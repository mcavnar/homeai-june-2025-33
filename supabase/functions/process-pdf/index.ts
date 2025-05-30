
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Processing extracted text. Length:', extractedText.length);

    // Return the full extracted text for verification
    const analysis = {
      summary: extractedText, // Show the full extracted text
      fullTextLength: extractedText.length,
    };

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
