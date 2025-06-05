import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inline text cleaning function to avoid import issues
const cleanExtractedText = (rawText: string): string => {
  console.log('Starting text cleaning. Original length:', rawText.length);
  
  let cleanedText = rawText;
  
  // Remove binary/garbled characters and non-printable characters
  cleanedText = cleanedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  
  // Split into lines for line-by-line filtering
  const lines = cleanedText.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines or lines with only whitespace
    if (trimmedLine.length === 0) return false;
    
    // Remove standalone page numbers and simple navigation
    if (/^page\s+\d+(\s+of\s+\d+)?$/i.test(trimmedLine)) return false;
    if (/^\d+\s*$/.test(trimmedLine) && trimmedLine.length < 4) return false;
    
    // PRESERVE IMPORTANT INSPECTION CONTENT - always keep these lines
    if (/\b(defect|repair|recommend|safety|issue|concern|damage|replace|inspect|condition|system|problem|maintenance|upgrade|install|fix)\b/i.test(trimmedLine)) return true;
    if (/\b(immediate|urgent|high priority|medium priority|low priority|attention|caution|warning)\b/i.test(trimmedLine)) return true;
    if (/\b(electrical|plumbing|hvac|roof|foundation|structural|mechanical|interior|exterior)\b/i.test(trimmedLine)) return true;
    
    return true;
  });
  
  // Rejoin the filtered lines
  cleanedText = filteredLines.join('\n');
  
  // Remove excessive whitespace but preserve paragraph structure
  cleanedText = cleanedText.replace(/\n{4,}/g, '\n\n\n');
  cleanedText = cleanedText.replace(/[ \t]{2,}/g, ' ');
  
  cleanedText = cleanedText.trim();
  
  const reductionPercentage = ((rawText.length - cleanedText.length) / rawText.length * 100);
  
  console.log('Text cleaning completed. Cleaned length:', cleanedText.length);
  console.log('Size reduction:', reductionPercentage.toFixed(1) + '%');
  
  return cleanedText;
};

// Inline OpenAI analyzer function with comprehensive error handling
const analyzeWithOpenAI = async (cleanedText: string) => {
  console.log('=== OpenAI Analysis Starting ===');
  const startTime = Date.now();
  
  // Validate API key
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not found in environment variables');
    throw new Error('OpenAI API key not configured');
  }
  console.log('OpenAI API key validated successfully');

  console.log('Analysis parameters:', {
    textLength: cleanedText.length,
    textSample: cleanedText.substring(0, 200) + '...'
  });

  // Smart text management - reduce size if too large
  let processedText = cleanedText;
  if (cleanedText.length > 12000) {
    console.log('Text exceeds 12k characters, applying reduction');
    // Simple reduction - take first portion that contains most important content
    processedText = cleanedText.substring(0, 12000);
    console.log('After reduction, text length:', processedText.length);
  }

  // Inline system prompt
  const systemPrompt = `You are an expert home inspector and real estate professional. Analyze home inspection reports and provide structured, actionable insights.

CRITICAL: Extract ALL significant issues, defects, and recommendations. Each individual problem should be a separate item.

Return ONLY valid JSON with this structure:
{
  "propertyInfo": {
    "address": "extracted address if found",
    "inspectionDate": "extracted date if found"
  },
  "executiveSummary": [
    "5 clear bullet points summarizing overall condition"
  ],
  "majorSystems": {
    "roof": "brief assessment",
    "foundation": "brief assessment", 
    "electrical": "brief assessment",
    "plumbing": "brief assessment",
    "hvac": "brief assessment"
  },
  "issues": [
    {
      "description": "specific issue description",
      "priority": "immediate, high, medium, or low",
      "estimatedCost": {"min": number, "max": number},
      "category": "system category"
    }
  ],
  "safetyIssues": ["safety concerns"],
  "costSummary": {
    "immediatePriorityTotal": {"min": number, "max": number},
    "highPriorityTotal": {"min": number, "max": number},
    "mediumPriorityTotal": {"min": number, "max": number},
    "lowPriorityTotal": {"min": number, "max": number},
    "grandTotal": {"min": number, "max": number}
  }
}`;

  const userPrompt = `Analyze this inspection report and extract all issues systematically. Each actionable problem should be a separate issue entry.

Report text:
${processedText}`;

  // OpenAI API call with comprehensive error handling
  try {
    console.log('Making OpenAI API request...');
    
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 8000,
    };

    console.log('Request configuration:', {
      model: requestBody.model,
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      maxTokens: requestBody.max_tokens
    });

    const response = await Promise.race([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      )
    ]) as Response;

    console.log('OpenAI response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500)
      });
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    console.log('OpenAI response parsed:', {
      processingTimeMs: processingTime,
      usage: data.usage,
      hasChoices: !!data.choices,
      choicesCount: data.choices?.length || 0
    });

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid OpenAI response structure:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response format from OpenAI - missing content');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content received:', {
      contentLength: content.length,
      contentStart: content.substring(0, 200)
    });

    // Parse JSON with detailed error handling
    try {
      const analysis = JSON.parse(content);
      
      // Validate required structure
      if (!analysis || typeof analysis !== 'object') {
        throw new Error('Analysis is not a valid object');
      }

      console.log('Analysis validation:', {
        hasPropertyInfo: !!analysis.propertyInfo,
        hasExecutiveSummary: !!analysis.executiveSummary,
        hasMajorSystems: !!analysis.majorSystems,
        hasIssues: !!analysis.issues,
        issuesCount: analysis.issues?.length || 0,
        hasSafetyIssues: !!analysis.safetyIssues,
        safetyIssuesCount: analysis.safetyIssues?.length || 0,
        hasCostSummary: !!analysis.costSummary
      });

      console.log('=== OpenAI Analysis Completed Successfully ===');
      return analysis;

    } catch (parseError) {
      console.error('JSON parsing failed:', {
        error: parseError.message,
        contentLength: content.length,
        contentSample: content.substring(0, 1000),
        parseErrorDetails: parseError.stack
      });
      
      // Try to identify the parsing issue
      const bracketCount = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
      console.error('JSON validation - bracket imbalance:', bracketCount);
      
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('OpenAI analysis error:', {
      message: error.message,
      name: error.name,
      processingTimeMs: processingTime
    });

    // Simple retry for timeout errors only
    if (error.message.includes('timeout') && processedText.length > 6000) {
      console.log('Attempting retry with further reduced text...');
      try {
        const retryText = processedText.substring(0, 6000);
        return await analyzeWithOpenAI(retryText);
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
        throw new Error(`Analysis failed: ${error.message}. Retry also failed.`);
      }
    }

    throw error;
  }
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
