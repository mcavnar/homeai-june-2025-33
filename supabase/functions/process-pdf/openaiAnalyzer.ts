import { parseAIResponse } from './jsonParser.ts';

export const analyzeWithOpenAI = async (cleanedText: string) => {
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

  // Enhanced system prompt with your specifications
  const systemPrompt = `You are an expert home inspector and real estate professional. Analyze home inspection reports and provide structured, actionable insights that help homeowners understand what needs attention and how much it might cost.

Your analysis should be:
- Practical and specific
- Focused on safety and financial impact
- Emphasize major systems condition, with a focus on HVAC, Electrical, Plumbing, and Roof and present other possible issues for those systems than may be apparent, for instance, if an HVAC is not cooling properly, it could be a more expensive repair. Highlighting surface level issues that may have deeper impact for major systems would be helpful.
- Helpful for prioritizing repairs
- The cost estimates provided for each issue should reflect any available pricing you have access to for similar issues and should be presented in a range. When in doubt, err on the upper end of the range.
- Comprehensive and thorough
- typical inspection reports contain at least 15-25 findings and some contain up to 100. Include both major issues and routine maintenance items to provide comprehensive value.

CRITICAL: Extract ALL significant issues, defects, and recommendations. Each individual problem should be a separate item. Be thorough and comprehensive - look for every possible issue, no matter how minor.

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

  const userPrompt = `Please analyze this home inspection report thoroughly and extract the structured information requested. Include significant findings across all priority levels, from safety concerns to maintenance recommendations. Focus on being specific about issues, their locations, realistic cost estimates, and actionable priorities.

Be extremely thorough - look for every possible issue mentioned in the report, including:
- Major system problems and potential underlying issues
- Minor maintenance items
- Safety concerns
- Cosmetic issues that could indicate larger problems
- Routine maintenance recommendations
- Any recommendations made by the inspector

Report text:
${processedText}`;

  // OpenAI API call with comprehensive error handling
  try {
    console.log('Making OpenAI API request...');
    
    const requestBody = {
      model: 'gpt-4.1-2025-04-14',
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
            model: 'gpt-4.1-2025-04-14',
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
