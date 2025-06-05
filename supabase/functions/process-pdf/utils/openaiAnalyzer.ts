
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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    console.log('Full OpenAI response data:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    const content = data.choices[0].message.content;
    console.log('Raw OpenAI content:', content);
    console.log('Content length:', content.length);
    
    try {
      const analysis = JSON.parse(content);
      console.log('Successfully parsed OpenAI analysis');
      console.log('Number of issues found:', analysis.issues ? analysis.issues.length : 0);
      console.log('Issues array:', JSON.stringify(analysis.issues, null, 2));
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw content that failed to parse:', content);
      throw new Error('Failed to parse AI analysis response');
    }

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};
