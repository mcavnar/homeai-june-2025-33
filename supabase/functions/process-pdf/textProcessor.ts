
export const processTextForAnalysis = (cleanedText: string) => {
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

  return processedText;
};
