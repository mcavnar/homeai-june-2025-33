
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple PDF text extraction using a different approach
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('Starting PDF text extraction...');
    
    // Convert ArrayBuffer to Uint8Array for processing
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction approach - look for readable text patterns
    let extractedText = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    
    // Convert to string and extract readable text
    const pdfString = decoder.decode(uint8Array);
    
    // Look for text between parentheses and brackets which often contain readable content
    const textMatches = pdfString.match(/\(([^)]+)\)/g) || [];
    const bracketMatches = pdfString.match(/\[([^\]]+)\]/g) || [];
    
    // Extract text from matches
    for (const match of textMatches) {
      const text = match.slice(1, -1); // Remove parentheses
      if (text.length > 2 && /[a-zA-Z]/.test(text)) {
        extractedText += text + ' ';
      }
    }
    
    for (const match of bracketMatches) {
      const text = match.slice(1, -1); // Remove brackets
      if (text.length > 2 && /[a-zA-Z]/.test(text)) {
        extractedText += text + ' ';
      }
    }
    
    // Also try to extract text using stream objects
    const streamMatches = pdfString.match(/stream\s*(.*?)\s*endstream/gs) || [];
    for (const streamMatch of streamMatches) {
      const streamContent = streamMatch.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
      // Look for readable text in streams
      const readableText = streamContent.match(/[a-zA-Z][a-zA-Z0-9\s.,!?;:'"()-]{10,}/g) || [];
      for (const text of readableText) {
        extractedText += text + ' ';
      }
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\\[rn]/g, ' ') // Replace escaped newlines
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    console.log(`Extracted text length: ${extractedText.length}`);
    console.log(`Sample text: ${extractedText.substring(0, 200)}`);
    
    if (extractedText.length < 20) {
      // Fallback: try to extract any readable sequences
      const fallbackMatches = pdfString.match(/[A-Za-z][A-Za-z0-9\s.,!?;:'"()-]{5,}/g) || [];
      extractedText = fallbackMatches.join(' ').substring(0, 5000);
      
      if (extractedText.length < 20) {
        throw new Error('Unable to extract readable text from PDF. The PDF may be image-based or corrupted.');
      }
    }
    
    return extractedText;
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
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

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('File must be a PDF');
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromPDF(arrayBuffer);
    
    console.log('Extraction successful. Text length:', extractedText.length);

    // Return the raw extracted text for verification
    const analysis = {
      summary: extractedText,
      extractedTextLength: extractedText.length,
      note: "Raw extracted text (basic extraction method)"
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
