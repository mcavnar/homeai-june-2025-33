
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to clean and extract JSON from OpenAI response
function cleanJsonResponse(content: string): string {
  // Remove markdown code block wrappers if present
  let cleaned = content.trim();
  
  // Remove ```json at the beginning
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  
  // Remove ``` at the end
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  // Trim any remaining whitespace
  return cleaned.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inspectionAnalysis, propertyData } = await req.json();

    console.log('Generating negotiation strategy with inspection and market data...');

    const prompt = `You are a real estate negotiation expert. Your client has already had an offer accepted on this home and received the inspection report. Based on the home inspection analysis and market data provided, generate a comprehensive negotiation strategy for a home buyer before closing, now that they know how much repairs will cost them.

INSPECTION DATA:
${JSON.stringify(inspectionAnalysis, null, 2)}

MARKET DATA:
${JSON.stringify(propertyData, null, 2)}

Generate a negotiation strategy with this EXACT JSON structure:

{
  "quickReference": {
    "recommendedAsk": {
      "min": [dollar amount],
      "max": [dollar amount]
    },
    "strongPoints": [
      "Brief bullet point about strongest negotiation leverage",
      "Another strong point based on inspection/market data",
      "Third compelling negotiation point"
    ]
  },
  "phaseGuide": {
    "initialResponse": [
      "First step in initial negotiation response",
      "Second step in initial response",
      "Third step in initial response"
    ],
    "counterNegotiation": [
      "How to handle seller counter-offers",
      "Key points to emphasize in counter-negotiation",
      "Fallback positions to consider"
    ],
    "finalStrategy": [
      "Final negotiation tactics",
      "Walk-away points to consider",
      "Closing strategy recommendations"
    ]
  }
}

IMPORTANT GUIDELINES:
1. Base recommendations on repair costs, market conditions, and property value
2. Consider days on market, sale-to-list ratio, and neighborhood data
3. Factor in safety issues and high-priority repairs for leverage
4. Make property-specific recommendations
5. Be realistic about market conditions and seller motivation
6. Include specific dollar amounts based on estimated repairs as well as actionable advice
7. Consider listing price, sold comparables, and time on market

Return ONLY the JSON object, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a real estate negotiation expert who provides data-driven negotiation strategies.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Raw OpenAI response:', content);

    // Clean the response to remove markdown wrappers
    const cleanedContent = cleanJsonResponse(content);
    console.log('Cleaned response:', cleanedContent);

    // Parse the JSON response
    let negotiationStrategy;
    try {
      negotiationStrategy = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse cleaned response as JSON:', parseError);
      console.error('Cleaned content was:', cleanedContent);
      throw new Error('Failed to parse negotiation strategy response');
    }

    // Validate the response structure
    if (!negotiationStrategy.quickReference || !negotiationStrategy.phaseGuide) {
      console.error('Invalid negotiation strategy structure:', negotiationStrategy);
      throw new Error('Invalid negotiation strategy structure received');
    }

    console.log('Successfully generated negotiation strategy');

    return new Response(JSON.stringify({ 
      success: true, 
      negotiationStrategy 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating negotiation strategy:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
