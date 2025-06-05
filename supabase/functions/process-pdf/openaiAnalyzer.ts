
import { parseAIResponse } from './jsonParser.ts';
import { processTextForAnalysis } from './textProcessor.ts';
import { createOpenAIRequest, callOpenAI } from './openaiClient.ts';

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

  // Process text for analysis
  const processedText = processTextForAnalysis(cleanedText);

  // Create OpenAI request configuration
  const requestConfig = createOpenAIRequest(processedText);

  // OpenAI API call with comprehensive error handling
  try {
    const data = await callOpenAI(requestConfig, openAIApiKey);
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
        
        const retryConfig = createOpenAIRequest(retryText);
        retryConfig.maxTokens = 4000; // Reduce tokens for retry
        
        const retryData = await callOpenAI(retryConfig, openAIApiKey);
        if (retryData.choices?.[0]?.message?.content) {
          return parseAIResponse(retryData.choices[0].message.content);
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
      }
    }

    throw error;
  }
};
