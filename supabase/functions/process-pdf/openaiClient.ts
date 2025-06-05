
import { SYSTEM_PROMPT, createUserPrompt } from './promptConfig.ts';

export interface OpenAIRequestConfig {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
}

export const createOpenAIRequest = (processedText: string): OpenAIRequestConfig => {
  return {
    model: 'gpt-4.1-2025-04-14',
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: createUserPrompt(processedText),
    temperature: 0.1,
    maxTokens: 8000,
  };
};

export const callOpenAI = async (config: OpenAIRequestConfig, apiKey: string) => {
  console.log('Making OpenAI API request...');
  
  const requestBody = {
    model: config.model,
    messages: [
      { role: 'system', content: config.systemPrompt },
      { role: 'user', content: config.userPrompt }
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  };

  console.log('Request configuration:', {
    model: requestBody.model,
    systemPromptLength: config.systemPrompt.length,
    userPromptLength: config.userPrompt.length,
    maxTokens: requestBody.max_tokens
  });

  const response = await Promise.race([
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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

  return response.json();
};
