
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

    // Return just the extracted text without OpenAI analysis
    const analysis = {
      summary: extractedText,
      extractedTextLength: extractedText.length,
      note: "Raw extracted text (OpenAI analysis disabled for testing)"
    };

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        extractedTextLength: extractedText.length,
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
