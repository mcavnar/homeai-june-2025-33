
export const parseAIResponse = (content: string) => {
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
