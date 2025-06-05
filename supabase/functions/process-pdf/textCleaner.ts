export const cleanExtractedText = (rawText: string): string => {
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
