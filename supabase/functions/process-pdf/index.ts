
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Enhanced text cleaning function
const cleanExtractedText = (rawText: string): string => {
  console.log('Starting text cleaning. Original length:', rawText.length);
  
  let cleanedText = rawText;
  
  // Remove binary/garbled characters and non-printable characters
  cleanedText = cleanedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  
  // Remove common PDF artifacts and metadata but preserve technical details
  cleanedText = cleanedText.replace(/(?:Producer|Creator|CreationDate|ModDate|Title|Subject|Keywords):\s*[^\n]*/gi, '');
  
  // Split into lines for line-by-line filtering
  const lines = cleanedText.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines or lines with only whitespace
    if (trimmedLine.length === 0) return false;
    
    // Remove page headers/footers patterns
    if (/^page\s+\d+(\s+of\s+\d+)?$/i.test(trimmedLine)) return false;
    if (/^\d+\s*$/.test(trimmedLine) && trimmedLine.length < 4) return false;
    
    // Remove common header/footer patterns but be less aggressive
    if (/^(home inspection|inspection report|property inspection)/i.test(trimmedLine) && trimmedLine.length < 30) return false;
    
    // Remove copyright and legal disclaimers
    if (/copyright|©|\(c\)|all rights reserved|proprietary|confidential/i.test(trimmedLine)) return false;
    if (/this report|liability|warranty|disclaimer|limitation/i.test(trimmedLine) && trimmedLine.length > 150) return false;
    
    // Remove contact information patterns
    if (/^(phone|tel|fax|email|website|www\.|http)/i.test(trimmedLine)) return false;
    if (/\b\d{3}[-.)]\s*\d{3}[-.)]\s*\d{4}\b/.test(trimmedLine) && trimmedLine.length < 50) return false;
    
    // Remove navigation elements
    if (/^(table of contents|index|contents|summary|overview)$/i.test(trimmedLine)) return false;
    if (/^(continued|see page|page \d+)/i.test(trimmedLine)) return false;
    
    // Remove lines that are mostly special characters
    if (/^[^\w\s]*$/.test(trimmedLine)) return false;
    if (trimmedLine.length > 5 && /^[_\-=.*#]{5,}$/.test(trimmedLine)) return false;
    
    return true;
  });
  
  // Rejoin the filtered lines
  cleanedText = filteredLines.join('\n');
  
  // Remove excessive whitespace but preserve structure
  cleanedText = cleanedText.replace(/\n{4,}/g, '\n\n\n'); // Replace 4+ line breaks with 3
  cleanedText = cleanedText.replace(/[ \t]{3,}/g, '  '); // Replace 3+ spaces/tabs with 2
  
  // Remove duplicate paragraphs (simple check for exact matches)
  const paragraphs = cleanedText.split('\n\n');
  const uniqueParagraphs = [];
  const seenParagraphs = new Set();
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed.length > 15 && !seenParagraphs.has(trimmed)) {
      seenParagraphs.add(trimmed);
      uniqueParagraphs.push(paragraph);
    } else if (trimmed.length <= 15) {
      uniqueParagraphs.push(paragraph);
    }
  }
  
  cleanedText = uniqueParagraphs.join('\n\n').trim();
  
  console.log('Text cleaning completed. Cleaned length:', cleanedText.length);
  console.log('Size reduction:', ((rawText.length - cleanedText.length) / rawText.length * 100).toFixed(1) + '%');
  
  return cleanedText;
};

// Enhanced OpenAI analysis function
const analyzeWithOpenAI = async (cleanedText: string) => {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Starting OpenAI analysis. Text length:', cleanedText.length);

  const systemPrompt = `You are an expert home inspector with 25+ years of experience. Your goal is to find EVERY SINGLE issue mentioned in the inspection report - no matter how small - and provide accurate 2024 cost estimates.

CRITICAL REQUIREMENTS:
1. Find ALL issues including:
   - Major structural/safety problems
   - Minor cosmetic issues (scratches, scuffs, worn paint)
   - Preventive maintenance items (filter changes, caulking)
   - Items mentioned as "should be monitored" or "keep an eye on"
   - Anything that deviates from perfect condition
   - Code violations or outdated systems

2. Use realistic 2024 cost estimates that include:
   - Current material costs (post-inflation)
   - Labor at $75-150/hour for skilled trades
   - Contractor markup of 20-30%
   - Permit costs where required
   - Small repairs: $100-800, Medium: $500-3,000, Large: $2,500-15,000+

3. Priority levels:
   - critical: Immediate safety hazards, code violations
   - high: Major systems needing repair/replacement soon
   - medium: Issues to address within 6-12 months
   - low: Minor issues, cosmetic, preventive maintenance

Return ONLY valid JSON without markdown formatting:`;

  const userPrompt = `Analyze this home inspection report and find EVERY issue mentioned, including minor ones. Use 2024 cost estimates that reflect current market rates with proper contractor markup.

${cleanedText}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 3500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response format from OpenAI');
    }

    const content = data.choices[0].message.content;
    console.log('Parsing OpenAI response content length:', content.length);
    
    // Simple JSON parsing with basic cleanup
    let cleanedContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    cleanedContent = cleanedContent.trim();
    
    try {
      const analysis = JSON.parse(cleanedContent);
      console.log('Successfully parsed analysis with', analysis.issues?.length || 0, 'issues');
      return analysis;
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Content that failed to parse (first 500 chars):', cleanedContent.substring(0, 500));
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { extractedText } = await req.json();
    
    if (!extractedText || typeof extractedText !== 'string') {
      throw new Error('No extracted text provided');
    }

    console.log('Processing extracted text. Original length:', extractedText.length);

    // Clean and filter the extracted text
    const cleanedText = cleanExtractedText(extractedText);

    if (cleanedText.length < 100) {
      throw new Error('Insufficient text content after cleaning for meaningful analysis');
    }

    // Analyze with OpenAI
    const analysis = await analyzeWithOpenAI(cleanedText);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        extractedTextLength: extractedText.length,
        cleanedTextLength: cleanedText.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing extracted text:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
