
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cleanExtractedText } from './textCleaner.ts';
import { analyzeWithOpenAI } from './openaiAnalyzer.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== PDF Processing Started ===');
  const startTime = Date.now();

  try {
    // Parse request with validation
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Request parsing failed:', parseError.message);
      throw new Error('Invalid JSON in request body');
    }

    const { extractedText } = requestBody;
    
    // Validate input
    if (!extractedText || typeof extractedText !== 'string') {
      console.error('Invalid extractedText:', {
        type: typeof extractedText,
        length: extractedText?.length,
        hasContent: !!extractedText
      });
      throw new Error('No extracted text provided or invalid format');
    }

    console.log('Input validation passed:', {
      originalLength: extractedText.length,
      hasContent: extractedText.length > 0
    });

    // Clean text with error handling
    let cleanedText;
    try {
      cleanedText = cleanExtractedText(extractedText);
      console.log('Text cleaning successful:', {
        cleanedLength: cleanedText.length,
        reductionPercent: ((extractedText.length - cleanedText.length) / extractedText.length * 100).toFixed(1)
      });
    } catch (cleaningError) {
      console.error('Text cleaning failed:', cleaningError.message);
      // Fallback to minimal cleaning
      cleanedText = extractedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '').trim();
      console.log('Using fallback cleaning, length:', cleanedText.length);
    }

    if (cleanedText.length < 100) {
      console.error('Insufficient text after cleaning:', cleanedText.length);
      throw new Error('Insufficient text content after cleaning for meaningful analysis');
    }

    // Analyze with OpenAI
    let analysis;
    try {
      analysis = await analyzeWithOpenAI(cleanedText);
      console.log('OpenAI analysis completed successfully');
    } catch (analysisError) {
      console.error('Analysis failed:', {
        message: analysisError.message,
        name: analysisError.name
      });
      throw new Error(`AI analysis failed: ${analysisError.message}`);
    }

    const totalTime = Date.now() - startTime;
    console.log(`=== Processing completed in ${totalTime}ms ===`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        cleanedText,
        extractedTextLength: extractedText.length,
        cleanedTextLength: cleanedText.length,
        processingTimeMs: totalTime
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('=== Processing Failed ===');
    console.error('Final error details:', {
      message: error.message,
      name: error.name,
      processingTimeMs: totalTime,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        processingTimeMs: totalTime,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
