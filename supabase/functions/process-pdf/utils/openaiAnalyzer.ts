
import { getSystemPrompt, getUserPrompt } from './prompts.ts';

// OpenAI analysis function
export const analyzeWithOpenAI = async (cleanedText: string) => {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Starting OpenAI analysis. Text length:', cleanedText.length);
  console.log('Text sample (first 1000 chars):', cleanedText.substring(0, 1000));

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
        model: 'gpt-4o', // Upgraded to more powerful model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1, // Lower temperature for more consistent extraction
        max_tokens: 15000, // Increased for comprehensive responses
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
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
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};
