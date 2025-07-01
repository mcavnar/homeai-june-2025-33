
/**
 * Normalizes text for search by handling common PDF text extraction issues
 */
export const normalizeTextForSearch = (text: string): string => {
  if (!text) return '';
  
  return text
    // Replace line breaks and carriage returns with spaces
    .replace(/[\r\n]+/g, ' ')
    // Replace multiple consecutive spaces with a single space
    .replace(/\s+/g, ' ')
    // Trim whitespace from start and end
    .trim()
    // Convert to lowercase for case-insensitive matching
    .toLowerCase();
};

/**
 * Normalizes text but preserves case for display purposes
 */
export const normalizeTextForDisplay = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if two text strings match after normalization
 */
export const textsMatch = (text1: string, text2: string): boolean => {
  return normalizeTextForSearch(text1) === normalizeTextForSearch(text2);
};

/**
 * Finds the index of a normalized search term in normalized text
 */
export const findNormalizedIndex = (text: string, searchTerm: string): number => {
  const normalizedText = normalizeTextForSearch(text);
  const normalizedSearchTerm = normalizeTextForSearch(searchTerm);
  
  return normalizedText.indexOf(normalizedSearchTerm);
};
