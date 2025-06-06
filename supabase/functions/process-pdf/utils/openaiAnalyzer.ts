
import { getSystemPrompt, getUserPrompt } from './prompts.ts';

// OpenAI analysis function
export const analyzeWithOpenAI = async (cleanedText: string) => {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Starting OpenAI analysis. Text length:', cleanedText.length);

  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(cleanedText);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Reverted to comprehensive premium model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Restored to 0.3 for better analysis depth and nuance
        max_tokens: 8000, // Keeping optimized token limit for speed/quality balance
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    const content = data.choices[0].message.content;
    console.log('Parsing OpenAI response...');
    console.log('Response length:', content.length);
    
    // Check if response appears to be truncated
    if (!content.trim().endsWith('}')) {
      console.warn('Response appears to be truncated - does not end with }');
      console.log('Last 200 characters:', content.slice(-200));
    }
    
    try {
      const analysis = JSON.parse(content);
      console.log('Successfully parsed OpenAI analysis');
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Response length:', content.length);
      console.error('First 500 characters:', content.substring(0, 500));
      console.error('Last 500 characters:', content.slice(-500));
      
      // Try to find where the JSON might be malformed
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      console.error('Open braces:', openBraces, 'Close braces:', closeBraces);
      
      throw new Error('Failed to parse AI analysis response - likely truncated due to token limit');
    }

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};
