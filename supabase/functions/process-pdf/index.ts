
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Improved PDF text extraction function
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
    let text = decoder.decode(uint8Array);
    
    // Remove null bytes and other binary characters
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
    
    // Extract text between parentheses (common PDF text format)
    const textInParentheses = text.match(/\(([^)]+)\)/g) || [];
    let extractedText = textInParentheses
      .map(match => match.slice(1, -1))
      .filter(text => text.length > 2 && /[a-zA-Z]/.test(text))
      .join(' ');
    
    // Extract text between square brackets with TJ operator
    const tjMatches = text.match(/\[([^\]]+)\]\s*TJ/gi) || [];
    const tjText = tjMatches
      .map(match => match.replace(/\[([^\]]+)\]\s*TJ/gi, '$1'))
      .filter(text => text.length > 2)
      .join(' ');
    
    // Combine and clean text
    let combinedText = (extractedText + ' ' + tjText).trim();
    
    // If still not much text, try to extract any readable sequences
    if (combinedText.length < 200) {
      const readablePatterns = text.match(/[A-Za-z][A-Za-z0-9\s,.-]{10,}/g) || [];
      combinedText = readablePatterns.join(' ').trim();
    }
    
    // Clean up multiple spaces and normalize
    combinedText = combinedText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, ' ')
      .trim();
    
    return combinedText || "Unable to extract readable text from PDF";
  } catch (error) {
    console.error('PDF extraction error:', error);
    return "Error extracting text from PDF";
  }
}

// Function to truncate text to fit OpenAI token limits
function truncateTextForOpenAI(text: string, maxTokens: number = 8000): string {
  // Rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 3; // Conservative estimate
  
  if (text.length <= maxChars) {
    return text;
  }
  
  // Try to truncate at sentence boundaries first
  const truncated = text.substring(0, maxChars);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > maxChars * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  // Fall back to word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

function createHomeInspectionPrompt(extractedText: string): string {
  return `You are an expert home inspection report analyzer. Analyze the following home inspection report text and create a structured summary.

PRIORITIZATION RULES:
🔴 HIGH PRIORITY (Always include):
- Structural problems (foundation cracks, roof damage)
- Electrical hazards (exposed wires, outdated panels)
- Major plumbing leaks or sewer issues
- HVAC system malfunction
- Water damage or mold
- Pest infestations (especially termites)
- Fire safety risks (missing smoke detectors, chimney issues)

🟡 MEDIUM PRIORITY (Include if significant):
- Poor insulation or ventilation
- Drainage/grading problems
- Minor plumbing/electrical issues
- Window and door damage
- Appliance defects

🟢 LOW PRIORITY (Only if noteworthy):
- Cosmetic issues
- Normal wear and tear

SEVERITY DETECTION - Look for these context phrases:
High severity: "needs immediate repair", "safety hazard", "significant damage", "not up to code", "beyond expected lifespan"
Low severity: "typical for age", "cosmetic only", "minor issue", "no action required", "maintenance recommended"

FORMAT YOUR RESPONSE as a JSON object with this structure:
{
  "majorSystems": {
    "roof": "summary of roof findings with priority level",
    "foundation": "summary of foundation findings",
    "electrical": "summary of electrical findings",
    "plumbing": "summary of plumbing findings",
    "hvac": "summary of HVAC findings"
  },
  "safetyIssues": [
    "list of safety-related findings"
  ],
  "highPriorityIssues": [
    "list of issues requiring immediate attention"
  ],
  "mediumPriorityIssues": [
    "list of issues to address soon"
  ],
  "summary": "overall assessment in 2-3 sentences"
}

Report text to analyze:
${extractedText}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Processing PDF file:', file.name, 'Size:', file.size);

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromPDF(arrayBuffer);
    
    console.log('Extracted text length:', extractedText.length);
    console.log('Sample text:', extractedText.substring(0, 500));

    if (extractedText.length < 50) {
      throw new Error('Could not extract sufficient text from PDF. The file may be image-based or corrupted.');
    }

    // Truncate text to fit OpenAI limits
    const truncatedText = truncateTextForOpenAI(extractedText, 15000);
    console.log('Truncated text length:', truncatedText.length);

    // Use OpenAI to analyze the extracted text
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: createHomeInspectionPrompt(truncatedText)
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json().catch(() => ({}));
      console.error('OpenAI API error:', openAIResponse.status, errorData);
      
      if (openAIResponse.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again in a few minutes.');
      }
      
      throw new Error(`OpenAI API error: ${openAIResponse.status}. Please check your API key and try again.`);
    }

    const openAIData = await openAIResponse.json();
    const analysisText = openAIData.choices[0].message.content;
    
    console.log('OpenAI analysis received');

    // Try to parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback to simple text analysis
      analysis = {
        summary: analysisText,
        extractedTextLength: truncatedText.length,
        note: "Analysis returned as text due to parsing issues"
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        extractedTextLength: truncatedText.length,
        originalTextLength: extractedText.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing PDF:', error);
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
