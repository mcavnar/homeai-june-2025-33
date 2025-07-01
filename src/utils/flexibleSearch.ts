
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
 * Split text into searchable chunks for flexible matching
 */
export const splitIntoSearchableChunks = (text: string): SearchChunk[] => {
  // Split into sentences first, then into word sequences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: SearchChunk[] = [];
  
  let currentIndex = 0;
  
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
    
    // Create overlapping word sequences of different lengths
    for (let length = 3; length <= Math.min(words.length, 8); length++) {
      for (let start = 0; start <= words.length - length; start++) {
        const chunkWords = words.slice(start, start + length);
        const chunkText = chunkWords.join(' ');
        
        chunks.push({
          text: chunkText,
          words: chunkWords,
          originalIndex: currentIndex + sentence.indexOf(chunkWords[0])
        });
      }
    }
    
    currentIndex += sentence.length + 1; // +1 for the delimiter
  }
  
  return chunks;
};

/**
 * Find flexible matches using word sequence matching
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
    
    if (normalizedChunk.length < 10) continue; // Skip very short chunks
    
    let searchIndex = 0;
    while (true) {
      const matchIndex = normalizedPageText.indexOf(normalizedChunk, searchIndex);
      if (matchIndex === -1) break;
      
      // Calculate confidence based on chunk length and word count
      const confidence = Math.min(
        0.5 + (chunk.words.length * 0.1) + (normalizedChunk.length * 0.01),
        1.0
      );
      
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
  
  // Sort by confidence and remove duplicates
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .filter((match, index, arr) => {
      // Remove matches that are too close to higher confidence matches
      return !arr.slice(0, index).some(prev => 
        Math.abs(prev.textIndex - match.textIndex) < 20
      );
    })
    .slice(0, 5); // Keep top 5 matches per page
};

/**
 * Score match quality for ranking
 */
export const scoreMatchQuality = (match: FlexibleMatch, originalQuery: string): number => {
  let score = match.confidence;
  
  // Boost score for longer matches
  if (match.text.length > 50) score += 0.2;
  if (match.text.length > 100) score += 0.2;
  
  // Boost score for matches that contain more words from original query
  const queryWords = normalizeTextForSearch(originalQuery).split(/\s+/);
  const matchWords = match.text.split(/\s+/);
  const commonWords = queryWords.filter(word => 
    matchWords.some(mWord => mWord.includes(word) || word.includes(mWord))
  );
  const wordRatio = commonWords.length / queryWords.length;
  score += wordRatio * 0.3;
  
  return Math.min(score, 1.0);
};

/**
 * Perform multi-strategy search
 */
export const performMultiStrategySearch = (
  pageText: string,
  searchQuery: string,
  pageNumber: number
): FlexibleMatch[] => {
  const allMatches: FlexibleMatch[] = [];
  
  // Strategy 1: Exact match (case-insensitive)
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
  }
  
  // Strategy 2: Normalized match (current approach)
  const normalizedPageText = normalizeTextForSearch(pageText);
  const normalizedQuery = normalizeTextForSearch(searchQuery);
  let normalizedIndex = normalizedPageText.indexOf(normalizedQuery);
  
  if (normalizedIndex !== -1 && !allMatches.length) {
    allMatches.push({
      pageNumber,
      textIndex: normalizedIndex,
      text: normalizedQuery,
      strategy: 'normalized',
      confidence: 0.9
    });
  }
  
  // Strategy 3: Flexible match (new approach)
  if (!allMatches.length && searchQuery.length > 20) {
    const flexibleMatches = findFlexibleMatches(pageText, searchQuery, pageNumber);
    allMatches.push(...flexibleMatches);
  }
  
  // Score and sort all matches
  return allMatches
    .map(match => ({
      ...match,
      confidence: scoreMatchQuality(match, searchQuery)
    }))
    .sort((a, b) => b.confidence - a.confidence);
};
