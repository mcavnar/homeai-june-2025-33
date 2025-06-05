import { getSystemPrompt, getUserPrompt } from './prompts.ts';

// OpenAI analysis function with balanced performance optimizations
export const analyzeWithOpenAI = async (cleanedText: string) => {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const startTime = Date.now();
  console.log('Starting OpenAI analysis. Text length:', cleanedText.length);
  console.log('Text sample (first 1000 chars):', cleanedText.substring(0, 1000));

  // Smart text size management - apply more aggressive cleaning if text is too large
  let processedText = cleanedText;
  if (cleanedText.length > 15000) {
    console.log('Text size exceeds 15k characters, applying additional cleaning');
    processedText = applyAggressiveCleaning(cleanedText);
    console.log('After aggressive cleaning, text length:', processedText.length);
  }

  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(processedText);

  try {
    const response = await Promise.race([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Reverted to faster model for better performance
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1, // Lower temperature for more consistent extraction
          max_tokens: 10000, // Reduced from 15000 for better performance while still allowing comprehensive results
        }),
      }),
      // 45-second timeout to prevent edge function timeouts
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI request timeout after 45 seconds')), 45000)
      )
    ]) as Response;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    console.log('OpenAI response received in', processingTime, 'ms');
    console.log('Usage stats:', JSON.stringify(data.usage, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    const content = data.choices[0].message.content;
    console.log('Raw OpenAI content length:', content.length);
    console.log('Raw OpenAI content (first 1000 chars):', content.substring(0, 1000));
    
    try {
      const analysis = JSON.parse(content);
      console.log('Successfully parsed OpenAI analysis');
      console.log('Number of issues found:', analysis.issues ? analysis.issues.length : 0);
      console.log('Executive summary points:', analysis.executiveSummary ? analysis.executiveSummary.length : 0);
      console.log('Safety issues count:', analysis.safetyIssues ? analysis.safetyIssues.length : 0);
      
      if (analysis.issues && analysis.issues.length > 0) {
        console.log('Sample issues found:');
        analysis.issues.slice(0, 5).forEach((issue: any, index: number) => {
          console.log(`${index + 1}. ${issue.description} (${issue.priority}, ${issue.category})`);
        });
      }
      
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw content that failed to parse:', content);
      throw new Error('Failed to parse AI analysis response');
    }

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    
    // Retry logic with more aggressive text cleaning and lower token limit
    if (error.message.includes('timeout') && cleanedText.length > 10000) {
      console.log('Timeout detected, attempting retry with more aggressive text cleaning');
      return retryWithReducedComplexity(cleanedText, openAIApiKey, startTime);
    }
    
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

// Retry function with more aggressive cleaning and reduced complexity
const retryWithReducedComplexity = async (originalText: string, apiKey: string, startTime: number) => {
  console.log('Starting retry with reduced complexity');
  
  // Apply very aggressive cleaning
  const reducedText = applyAggressiveCleaning(originalText);
  console.log('Retry text length:', reducedText.length);
  
  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(reducedText);
  
  try {
    const response = await Promise.race([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 8000, // Further reduced for retry
        }),
      }),
      // 30-second timeout for retry
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Retry timeout after 30 seconds')), 30000)
      )
    ]) as Response;

    if (!response.ok) {
      throw new Error(`OpenAI API error on retry: ${response.status}`);
    }

    const data = await response.json();
    const totalTime = Date.now() - startTime;
    console.log('Retry completed successfully in total time:', totalTime, 'ms');
    
    const content = data.choices[0].message.content;
    const analysis = JSON.parse(content);
    console.log('Retry analysis - issues found:', analysis.issues ? analysis.issues.length : 0);
    
    return analysis;
  } catch (retryError) {
    console.error('Retry also failed:', retryError);
    throw new Error(`AI analysis failed even after retry: ${retryError.message}`);
  }
};

// More aggressive text cleaning for large documents
const applyAggressiveCleaning = (text: string): string => {
  console.log('Applying aggressive text cleaning');
  
  let cleaned = text;
  
  // Remove more aggressive patterns for large documents
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine.length === 0) return false;
    
    // Remove very short lines that are likely artifacts
    if (trimmedLine.length < 3) return false;
    
    // Remove obvious header/footer patterns more aggressively
    if (/^(page|report|inspection|client|inspector|date|time|address|property)$/i.test(trimmedLine)) return false;
    
    // Remove lines that are mostly numbers or single words
    if (/^\d+$/.test(trimmedLine) || (/^[a-zA-Z]+$/.test(trimmedLine) && trimmedLine.length < 8)) return false;
    
    // Remove navigation and table of contents more aggressively
    if (/^(continued|see|page|table|contents|index|next|previous)$/i.test(trimmedLine)) return false;
    
    // Remove contact information and legal text
    if (/(phone|email|www\.|http|@|\.com|copyright|disclaimer|liability)/i.test(trimmedLine)) return false;
    
    // PRESERVE important inspection content - always keep these
    if (/\b(defect|repair|recommend|safety|issue|concern|damage|replace|inspect|condition|system|problem|maintenance|upgrade|install|fix|leak|crack|loose|missing|broken|worn|old|new)\b/i.test(trimmedLine)) return true;
    if (/\b(immediate|urgent|high priority|medium priority|low priority|attention|caution|warning|hazard|dangerous)\b/i.test(trimmedLine)) return true;
    if (/\b(electrical|plumbing|hvac|roof|foundation|structural|mechanical|interior|exterior|kitchen|bathroom)\b/i.test(trimmedLine)) return true;
    
    // Keep lines with measurements or technical details
    if (/\b\d+\s*(inch|ft|feet|amp|volt|psi|degree|°)\b/i.test(trimmedLine)) return true;
    
    // Remove very long lines that are likely disclaimers or repetitive text
    if (trimmedLine.length > 200) return false;
    
    return true;
  });
  
  cleaned = filteredLines.join('\n');
  
  // Additional cleanup
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Reduce multiple line breaks
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' '); // Reduce multiple spaces
  cleaned = cleaned.trim();
  
  const reductionPercentage = ((text.length - cleaned.length) / text.length * 100);
  console.log('Aggressive cleaning reduction:', reductionPercentage.toFixed(1) + '%');
  
  return cleaned;
};
