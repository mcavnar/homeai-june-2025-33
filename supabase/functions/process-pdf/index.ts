
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple PDF text extraction function
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction - looking for text objects in PDF
    const decoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
    let text = decoder.decode(uint8Array);
    
    // Extract text between common PDF text markers
    const textMatches = text.match(/\((.*?)\)/g) || [];
    const extractedTexts = textMatches
      .map(match => match.slice(1, -1))
      .filter(text => text.length > 3 && /[a-zA-Z]/.test(text))
      .join(' ');
    
    // Also try to extract text between Tj operators
    const tjMatches = text.match(/\[(.*?)\]\s*TJ/g) || [];
    const tjTexts = tjMatches
      .map(match => match.replace(/\[(.*?)\]\s*TJ/, '$1'))
      .filter(text => text.length > 3)
      .join(' ');
    
    // Combine extracted texts
    let combinedText = (extractedTexts + ' ' + tjTexts).trim();
    
    // If we didn't get much text, try a different approach
    if (combinedText.length < 100) {
      // Look for readable text patterns
      const readableText = text.match(/[A-Za-z\s]{10,}/g);
      if (readableText) {
        combinedText = readableText.join(' ').trim();
      }
    }
    
    return combinedText || "Unable to extract readable text from PDF";
  } catch (error) {
    console.error('PDF extraction error:', error);
    return "Error extracting text from PDF";
  }
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
    console.log('Sample text:', extractedText.substring(0, 200));

    if (extractedText.length < 50) {
      throw new Error('Could not extract sufficient text from PDF');
    }

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
            content: createHomeInspectionPrompt(extractedText)
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const analysisText = openAIData.choices[0].message.content;
    
    console.log('OpenAI analysis:', analysisText);

    // Try to parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback to simple text analysis
      analysis = {
        summary: analysisText,
        extractedText: extractedText.substring(0, 1000)
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        extractedTextLength: extractedText.length
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
