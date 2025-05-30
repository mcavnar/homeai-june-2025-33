
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

// Function to clean OpenAI response and extract JSON
const cleanAndParseJSON = (content: string) => {
  console.log('Raw OpenAI content length:', content.length);
  
  // Remove markdown code block markers if present
  let cleanedContent = content.trim();
  
  // Remove ```json at the beginning
  cleanedContent = cleanedContent.replace(/^```json\s*/i, '');
  
  // Remove ``` at the end
  cleanedContent = cleanedContent.replace(/\s*```$/, '');
  
  // Trim any remaining whitespace
  cleanedContent = cleanedContent.trim();
  
  console.log('Cleaned content length:', cleanedContent.length);
  console.log('First 200 chars:', cleanedContent.substring(0, 200));
  
  try {
    const parsed = JSON.parse(cleanedContent);
    console.log('Successfully parsed JSON');
    return parsed;
  } catch (parseError) {
    console.error('JSON parse error:', parseError.message);
    console.error('Content that failed to parse:', cleanedContent.substring(0, 500));
    throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
  }
};

// Enhanced OpenAI analysis function
const analyzeWithOpenAI = async (cleanedText: string) => {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Starting OpenAI analysis. Text length:', cleanedText.length);

  const systemPrompt = `You are a master home inspector with 20+ years of experience and deep knowledge of current 2024 construction costs, building codes, and real estate markets. Your goal is to identify EVERY issue in the inspection report, no matter how minor, and provide accurate cost estimates based on current market rates.

ANALYSIS REQUIREMENTS:

1. **Find ALL Issues**: Look for every single issue mentioned, including:
   - Major structural/safety problems
   - Minor cosmetic issues
   - Preventive maintenance items
   - Code violations or outdated systems
   - Items that "should be monitored"
   - Anything that needs attention now or in the future

2. **Cost Estimation Guidelines (2024 rates)**:
   - Include labor, materials, permits, contractor markup (20-30%)
   - Account for regional variations when location is known
   - Small repairs: $100-500
   - Medium repairs: $500-2,500  
   - Large repairs: $2,500-10,000+
   - Major systems: $5,000-25,000+
   - Use realistic contractor rates: $75-150/hour for skilled trades
   - Factor in permit costs for electrical, plumbing, structural work

3. **Priority System**:
   - CRITICAL: Immediate safety hazards, code violations (0-30 days)
   - HIGH: Major systems needing repair/replacement (1-6 months)
   - MEDIUM: Issues that should be addressed soon (6-12 months)
   - LOW: Minor issues, cosmetic, preventive maintenance (1-2 years)

4. **Categories to Focus On**:
   - Electrical (outlets, panels, wiring, GFCI, safety)
   - Plumbing (leaks, pressure, fixtures, water heater)
   - HVAC (heating, cooling, ductwork, filters)
   - Structural (foundation, framing, stairs, railings)
   - Roofing (shingles, gutters, flashing, ventilation)
   - Moisture/Mold (basement, bathrooms, windows)
   - Safety (smoke detectors, carbon monoxide, railings)
   - Insulation/Energy efficiency
   - Exterior (siding, windows, doors, walkways)
   - Interior (flooring, walls, ceilings, doors)

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or extra text. Do not wrap your response in \`\`\`json blocks.

Return your response as valid JSON matching this exact structure:

{
  "propertyInfo": {
    "address": "extracted property address if found",
    "inspectionDate": "extracted inspection date if found"
  },
  "executiveSummary": [
    "exactly 5 clear, actionable bullet points summarizing the overall condition",
    "focus on the most important findings with cost implications",
    "include safety issues and major expenses",
    "mention total estimated repair costs",
    "provide overall property condition assessment"
  ],
  "majorSystems": {
    "roof": "detailed assessment including age, condition, and any issues",
    "foundation": "structural integrity, cracks, moisture, settling", 
    "electrical": "panel condition, wiring, outlets, safety issues",
    "plumbing": "water pressure, leaks, fixtures, water heater condition",
    "hvac": "heating/cooling system condition, ductwork, efficiency"
  },
  "issues": [
    {
      "description": "specific detailed issue description",
      "location": "exact location in the house",
      "priority": "critical, high, medium, or low",
      "timeframe": "when this should be addressed (e.g., 'Immediate', '1-3 months', '6-12 months', '1-2 years')",
      "estimatedCost": {
        "min": number,
        "max": number
      },
      "category": "system category (e.g., Electrical, Plumbing, Structural, Roofing, HVAC, Safety, Cosmetic, Preventive)"
    }
  ],
  "safetyIssues": [
    "list of specific safety concerns that need immediate attention with locations"
  ],
  "costSummary": {
    "criticalTotal": {"min": number, "max": number},
    "highPriorityTotal": {"min": number, "max": number},
    "mediumPriorityTotal": {"min": number, "max": number},
    "lowPriorityTotal": {"min": number, "max": number},
    "grandTotal": {"min": number, "max": number}
  }
}

IMPORTANT: Be thorough and find every issue mentioned. Don't skip minor items - homeowners want to know about everything. Use realistic 2024 cost estimates that account for current inflation and labor shortages.`;

  const userPrompt = `Please analyze this home inspection report comprehensively. Find EVERY issue mentioned, no matter how small, and provide detailed cost estimates based on current 2024 market rates. Include preventive maintenance items and anything that needs monitoring.

Here is the inspection report text:

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
        max_tokens: 4000,
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
    console.log('Processing OpenAI response content...');
    
    // Use the new cleaning and parsing function
    const analysis = cleanAndParseJSON(content);
    
    // Validate the parsed response has required fields
    if (!analysis || typeof analysis !== 'object') {
      throw new Error('Parsed response is not a valid object');
    }
    
    if (!analysis.issues || !Array.isArray(analysis.issues)) {
      console.warn('No issues array found in response, creating empty array');
      analysis.issues = [];
    }
    
    if (!analysis.costSummary || typeof analysis.costSummary !== 'object') {
      console.warn('No cost summary found in response, creating default');
      analysis.costSummary = {
        criticalTotal: { min: 0, max: 0 },
        highPriorityTotal: { min: 0, max: 0 },
        mediumPriorityTotal: { min: 0, max: 0 },
        lowPriorityTotal: { min: 0, max: 0 },
        grandTotal: { min: 0, max: 0 }
      };
    }
    
    console.log('Analysis validation completed successfully');
    return analysis;

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
