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

// Enhanced JSON parsing function with multiple fallback strategies
const parseAIResponse = (content: string) => {
  console.log('Starting JSON parsing, content length:', content.length);
  console.log('Content sample:', content.substring(0, 300));

  // Strategy 1: Try direct JSON parsing first
  try {
    const result = JSON.parse(content);
    console.log('Direct JSON parsing successful');
    return result;
  } catch (directError) {
    console.log('Direct JSON parsing failed:', directError.message);
  }

  // Strategy 2: Remove markdown code blocks
  let cleanedContent = content.trim();
  
  // Remove markdown code block wrappers
  if (cleanedContent.startsWith('```json')) {
    cleanedContent = cleanedContent.substring(7);
  } else if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.substring(3);
  }
  
  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
  }
  
  cleanedContent = cleanedContent.trim();
  
  try {
    const result = JSON.parse(cleanedContent);
    console.log('Markdown-cleaned JSON parsing successful');
    return result;
  } catch (markdownError) {
    console.log('Markdown-cleaned JSON parsing failed:', markdownError.message);
  }

  // Strategy 3: Find JSON object boundaries
  const firstBrace = cleanedContent.indexOf('{');
  const lastBrace = cleanedContent.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonCandidate = cleanedContent.substring(firstBrace, lastBrace + 1);
    try {
      const result = JSON.parse(jsonCandidate);
      console.log('Boundary-extracted JSON parsing successful');
      return result;
    } catch (boundaryError) {
      console.log('Boundary-extracted JSON parsing failed:', boundaryError.message);
    }
  }

  // Strategy 4: Remove common text artifacts
  let artifactCleaned = cleanedContent
    .replace(/^Here's the analysis.*?:/i, '')
    .replace(/^The analysis.*?:/i, '')
    .replace(/^Based on.*?:/i, '')
    .trim();

  if (artifactCleaned.startsWith('{') && artifactCleaned.endsWith('}')) {
    try {
      const result = JSON.parse(artifactCleaned);
      console.log('Artifact-cleaned JSON parsing successful');
      return result;
    } catch (artifactError) {
      console.log('Artifact-cleaned JSON parsing failed:', artifactError.message);
    }
  }

  // All strategies failed
  throw new Error(`All JSON parsing strategies failed. Content: ${content.substring(0, 500)}...`);
};

// Improved OpenAI analyzer function with better error handling
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
    processedText = cleanedText.substring(0, 12000);
    console.log('After reduction, text length:', processedText.length);
  }

  // Enhanced system prompt with explicit JSON format requirement
  const systemPrompt = `You are an expert home inspector and real estate professional. Analyze home inspection reports and provide structured, actionable insights.

CRITICAL: Extract ALL significant issues, defects, and recommendations. Each individual problem should be a separate item.

IMPORTANT: Return ONLY a valid JSON object with NO markdown formatting, NO code blocks, NO explanatory text. Start directly with { and end with }.

Use this EXACT JSON structure:
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

    // Parse JSON with enhanced error handling
    try {
      const analysis = parseAIResponse(content);
      
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
      console.error('Enhanced JSON parsing failed:', {
        error: parseError.message,
        contentLength: content.length,
        contentSample: content.substring(0, 1000),
        parseErrorDetails: parseError.stack
      });
      
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('OpenAI analysis error:', {
      message: error.message,
      name: error.name,
      processingTimeMs: processingTime
    });

    // Simple retry for timeout errors only (no recursion)
    if (error.message.includes('timeout') && processedText.length > 6000) {
      console.log('Attempting single retry with reduced text size...');
      try {
        const retryText = processedText.substring(0, 6000);
        console.log('Retry with text length:', retryText.length);
        
        // Make a single retry call with reduced parameters
        const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Analyze this inspection report (reduced size):\n\n${retryText}` }
            ],
            temperature: 0.1,
            max_tokens: 4000,
          }),
        });

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          const retryContent = retryData.choices[0].message.content;
          return parseAIResponse(retryContent);
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
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
