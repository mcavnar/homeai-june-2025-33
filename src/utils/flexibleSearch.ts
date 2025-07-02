
import { normalizeTextForSearch } from './textNormalization';

export interface FlexibleMatch {
  pageNumber: number;
  textIndex: number;
  text: string;
  strategy: 'exact' | 'normalized' | 'flexible';
  confidence: number;
}

export interface SearchChunk {
  text: string;
  words: string[];
  originalIndex: number;
}

/**
 * Split text into searchable chunks for flexible matching - more conservative approach
 */
export const splitIntoSearchableChunks = (text: string): SearchChunk[] => {
  // Split into sentences first, then into word sequences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: SearchChunk[] = [];
  
  let currentIndex = 0;
  
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
    
    // Create longer word sequences for more precise matching
    // Reduced flexibility - only create chunks of 5-10 words instead of 3-8
    for (let length = 5; length <= Math.min(words.length, 10); length++) {
      for (let start = 0; start <= words.length - length; start++) {
        const chunkWords = words.slice(start, start + length);
        const chunkText = chunkWords.join(' ');
        
        // Only create chunks that are substantial (at least 25 characters)
        if (chunkText.length >= 25) {
          chunks.push({
            text: chunkText,
            words: chunkWords,
            originalIndex: currentIndex + sentence.indexOf(chunkWords[0])
          });
        }
      }
    }
    
    currentIndex += sentence.length + 1; // +1 for the delimiter
  }
  
  return chunks;
};

/**
 * Find flexible matches using word sequence matching - more conservative
 */
export const findFlexibleMatches = (
  pageText: string, 
  searchQuery: string, 
  pageNumber: number
): FlexibleMatch[] => {
  const searchChunks = splitIntoSearchableChunks(searchQuery);
  const normalizedPageText = normalizeTextForSearch(pageText);
  const matches: FlexibleMatch[] = [];
  
  // Try to find each chunk in the page text
  for (const chunk of searchChunks) {
    const normalizedChunk = normalizeTextForSearch(chunk.text);
    
    // Increased minimum length requirement for more precision
    if (normalizedChunk.length < 25) continue;
    
    let searchIndex = 0;
    while (true) {
      const matchIndex = normalizedPageText.indexOf(normalizedChunk, searchIndex);
      if (matchIndex === -1) break;
      
      // More conservative confidence calculation
      const baseConfidence = 0.3; // Reduced base confidence
      const lengthBonus = Math.min(normalizedChunk.length * 0.005, 0.3); // Reduced bonus
      const wordCountBonus = Math.min(chunk.words.length * 0.05, 0.2); // Reduced bonus
      
      const confidence = baseConfidence + lengthBonus + wordCountBonus;
      
      matches.push({
        pageNumber,
        textIndex: matchIndex,
        text: normalizedChunk,
        strategy: 'flexible',
        confidence
      });
      
      searchIndex = matchIndex + 1;
    }
  }
  
  // Sort by confidence and remove duplicates - higher threshold
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .filter((match, index, arr) => {
      // Remove matches that are too close to higher confidence matches
      return !arr.slice(0, index).some(prev => 
        Math.abs(prev.textIndex - match.textIndex) < 50 // Increased distance threshold
      );
    })
    .slice(0, 3); // Reduced to top 3 matches per page
};

/**
 * Score match quality for ranking - more conservative
 */
export const scoreMatchQuality = (match: FlexibleMatch, originalQuery: string): number => {
  let score = match.confidence;
  
  // More conservative scoring
  if (match.text.length > 100) score += 0.1; // Reduced bonus
  if (match.text.length > 200) score += 0.1; // Reduced bonus
  
  // Boost score for matches that contain more words from original query
  const queryWords = normalizeTextForSearch(originalQuery).split(/\s+/);
  const matchWords = match.text.split(/\s+/);
  const commonWords = queryWords.filter(word => 
    matchWords.some(mWord => mWord.includes(word) || word.includes(mWord))
  );
  const wordRatio = commonWords.length / queryWords.length;
  score += wordRatio * 0.2; // Reduced bonus
  
  return Math.min(score, 1.0);
};

/**
 * Perform multi-strategy search with improved precision
 */
export const performMultiStrategySearch = (
  pageText: string,
  searchQuery: string,
  pageNumber: number
): FlexibleMatch[] => {
  const allMatches: FlexibleMatch[] = [];
  
  // Strategy 1: Exact match (case-insensitive) - HIGHEST PRIORITY
  const lowerPageText = pageText.toLowerCase();
  const lowerQuery = searchQuery.toLowerCase();
  let exactIndex = lowerPageText.indexOf(lowerQuery);
  
  if (exactIndex !== -1) {
    allMatches.push({
      pageNumber,
      textIndex: exactIndex,
      text: searchQuery,
      strategy: 'exact',
      confidence: 1.0
    });
    // If we have an exact match, return it immediately for source quotes
    return allMatches;
  }
  
  // Strategy 2: Normalized match - SECOND PRIORITY
  const normalizedPageText = normalizeTextForSearch(pageText);
  const normalizedQuery = normalizeTextForSearch(searchQuery);
  let normalizedIndex = normalizedPageText.indexOf(normalizedQuery);
  
  if (normalizedIndex !== -1) {
    allMatches.push({
      pageNumber,
      textIndex: normalizedIndex,
      text: normalizedQuery,
      strategy: 'normalized',
      confidence: 0.95
    });
    // If we have a normalized match, return it for source quotes
    return allMatches;
  }
  
  // Strategy 3: Flexible match - ONLY if no exact/normalized matches found
  // AND only for longer queries (likely source quotes)
  if (searchQuery.length > 30) {
    const flexibleMatches = findFlexibleMatches(pageText, searchQuery, pageNumber);
    // Apply higher confidence threshold for flexible matches
    const qualityMatches = flexibleMatches.filter(match => match.confidence > 0.6);
    allMatches.push(...qualityMatches);
  }
  
  // Score and sort all matches
  return allMatches
    .map(match => ({
      ...match,
      confidence: scoreMatchQuality(match, searchQuery)
    }))
    .sort((a, b) => b.confidence - a.confidence);
};
