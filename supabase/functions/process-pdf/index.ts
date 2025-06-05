
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cleanExtractedText } from './utils/textCleaner.ts';
import { analyzeWithOpenAI } from './utils/openaiAnalyzer.ts';

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
        cleanedText, // Include the cleaned text in the response
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
