
import { InspectionIssue } from '@/types/inspection';

export interface IssueSearchResult {
  pageNumber: number;
  confidence: number;
  matchedTerms: string[];
  searchTerms: string[];
  strategy: string;
}

// Equipment and system synonyms/variations
const SYNONYM_MAPPINGS: Record<string, string[]> = {
  'vent': ['ventilation', 'exhaust', 'ductwork', 'duct'],
  'dryer': ['laundry', 'clothes dryer', 'dryer vent'],
  'hvac': ['heating', 'cooling', 'air conditioning', 'furnace', 'heat pump'],
  'electrical': ['electric', 'wiring', 'outlet', 'switch', 'breaker', 'panel'],
  'plumbing': ['water', 'pipe', 'drain', 'faucet', 'toilet', 'sink'],
  'roof': ['roofing', 'shingle', 'gutter', 'downspout', 'flashing'],
  'window': ['windows', 'glazing', 'sash', 'frame'],
  'door': ['doors', 'entry', 'exterior door', 'interior door'],
  'foundation': ['basement', 'crawl space', 'slab', 'footing'],
  'insulation': ['insulate', 'thermal', 'vapor barrier'],
  'water damage': ['moisture', 'leak', 'wet', 'damp', 'stain'],
  'crack': ['cracked', 'split', 'fracture', 'separation'],
  'missing': ['absent', 'not present', 'removed'],
  'damaged': ['broken', 'deteriorated', 'worn', 'failed'],
  'safety': ['hazard', 'dangerous', 'unsafe', 'risk']
};

// High-value terms that often appear in inspection reports
const HIGH_VALUE_TERMS = [
  'water', 'electrical', 'plumbing', 'hvac', 'roof', 'foundation',
  'safety', 'damage', 'leak', 'crack', 'missing', 'broken',
  'vent', 'outlet', 'switch', 'pipe', 'drain', 'window', 'door',
  'insulation', 'gutter', 'shingle', 'breaker', 'panel', 'furnace'
];

// Terms that are too generic and should be deprioritized
const LOW_VALUE_TERMS = [
  'area', 'room', 'space', 'location', 'section', 'side', 'part',
  'thing', 'item', 'place', 'spot', 'zone', 'general', 'various'
];

/**
 * Score a term based on its importance for PDF searches
 */
const scoreSearchTerm = (term: string, context: InspectionIssue): number => {
  let score = 1;
  
  // Boost high-value inspection terms
  if (HIGH_VALUE_TERMS.includes(term.toLowerCase())) {
    score *= 3;
  }
  
  // Penalize low-value generic terms
  if (LOW_VALUE_TERMS.includes(term.toLowerCase())) {
    score *= 0.3;
  }
  
  // Boost equipment/system terms
  if (Object.keys(SYNONYM_MAPPINGS).includes(term.toLowerCase())) {
    score *= 2.5;
  }
  
  // Boost terms that appear in the issue category
  if (context.category.toLowerCase().includes(term.toLowerCase())) {
    score *= 2;
  }
  
  // Boost longer, more specific terms
  if (term.length > 6) {
    score *= 1.5;
  }
  
  // Boost compound terms (with spaces)
  if (term.includes(' ')) {
    score *= 1.8;
  }
  
  return score;
};

/**
 * Get all variations of a term including synonyms
 */
const getTermVariations = (term: string): string[] => {
  const variations = [term];
  const lowerTerm = term.toLowerCase();
  
  // Add direct synonyms
  if (SYNONYM_MAPPINGS[lowerTerm]) {
    variations.push(...SYNONYM_MAPPINGS[lowerTerm]);
  }
  
  // Add reverse synonyms (if term appears as a synonym)
  Object.entries(SYNONYM_MAPPINGS).forEach(([key, synonyms]) => {
    if (synonyms.includes(lowerTerm)) {
      variations.push(key, ...synonyms);
    }
  });
  
  // Remove duplicates and return
  return [...new Set(variations)];
};

/**
 * Extract and score search terms from an inspection issue
 */
export const extractIssueSearchTerms = (issue: InspectionIssue): Array<{term: string, score: number, variations: string[]}> => {
  const termMap = new Map<string, {score: number, variations: string[]}>();
  
  // Extract terms from different parts of the issue
  const sources = [
    { text: issue.description, weight: 1.0 },
    { text: issue.location, weight: 0.7 },
    { text: issue.category, weight: 0.8 }
  ];
  
  sources.forEach(({ text, weight }) => {
    const words = text.toLowerCase()
      .split(/[\s,\-\.]+/)
      .filter(word => word.length > 2);
    
    // Process individual words
    words.forEach(word => {
      const score = scoreSearchTerm(word, issue) * weight;
      const variations = getTermVariations(word);
      
      if (!termMap.has(word) || termMap.get(word)!.score < score) {
        termMap.set(word, { score, variations });
      }
    });
    
    // Process 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      const score = scoreSearchTerm(phrase, issue) * weight;
      const variations = getTermVariations(phrase);
      
      if (!termMap.has(phrase) || termMap.get(phrase)!.score < score) {
        termMap.set(phrase, { score, variations });
      }
    }
  });
  
  // Convert to array and sort by score
  return Array.from(termMap.entries())
    .map(([term, data]) => ({ term, ...data }))
    .sort((a, b) => b.score - a.score);
};

/**
 * Generate multiple search strategies for an issue
 */
export const generateSearchStrategies = (issue: InspectionIssue): Array<{query: string, strategy: string, confidence: number}> => {
  const rankedTerms = extractIssueSearchTerms(issue);
  const strategies: Array<{query: string, strategy: string, confidence: number}> = [];
  
  if (rankedTerms.length === 0) return strategies;
  
  // Strategy 1: Top 2-3 highest scoring terms
  const topTerms = rankedTerms.slice(0, 3).map(t => t.term);
  if (topTerms.length > 0) {
    strategies.push({
      query: topTerms.join(' '),
      strategy: 'top-terms',
      confidence: 0.9
    });
  }
  
  // Strategy 2: Best single term
  const bestTerm = rankedTerms[0];
  if (bestTerm) {
    strategies.push({
      query: bestTerm.term,
      strategy: 'best-single-term',
      confidence: 0.8
    });
  }
  
  // Strategy 3: Equipment/system focus
  const equipmentTerms = rankedTerms
    .filter(t => HIGH_VALUE_TERMS.includes(t.term.toLowerCase()))
    .slice(0, 2)
    .map(t => t.term);
  
  if (equipmentTerms.length > 0) {
    strategies.push({
      query: equipmentTerms.join(' '),
      strategy: 'equipment-focus',
      confidence: 0.85
    });
  }
  
  // Strategy 4: Synonyms of best term
  if (bestTerm && bestTerm.variations.length > 1) {
    const primarySynonym = bestTerm.variations.find(v => v !== bestTerm.term);
    if (primarySynonym) {
      strategies.push({
        query: primarySynonym,
        strategy: 'synonym-fallback',
        confidence: 0.7
      });
    }
  }
  
  // Strategy 5: Category-based search
  const categoryWords = issue.category.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3);
  if (categoryWords.length > 0) {
    strategies.push({
      query: categoryWords[0],
      strategy: 'category-based',
      confidence: 0.6
    });
  }
  
  return strategies.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Search for an issue in PDF text content using multiple strategies
 */
export const findIssueInPDF = (
  issue: InspectionIssue,
  pageTextContent: Map<number, { pageNumber: number; fullText: string }>
): IssueSearchResult | null => {
  const strategies = generateSearchStrategies(issue);
  
  for (const strategy of strategies) {
    const result = searchWithStrategy(strategy, pageTextContent);
    if (result) {
      return {
        ...result,
        strategy: strategy.strategy,
        searchTerms: [strategy.query]
      };
    }
  }
  
  return null;
};

/**
 * Execute a single search strategy
 */
const searchWithStrategy = (
  strategy: {query: string, confidence: number},
  pageTextContent: Map<number, { pageNumber: number; fullText: string }>
): {pageNumber: number, confidence: number, matchedTerms: string[]} | null => {
  const searchTerms = strategy.query.toLowerCase().split(/\s+/);
  let bestMatch: {pageNumber: number, confidence: number, matchedTerms: string[]} | null = null;
  let highestScore = 0;
  
  for (const [pageNum, content] of pageTextContent.entries()) {
    const pageText = content.fullText.toLowerCase();
    const matchedTerms: string[] = [];
    let score = 0;
    
    searchTerms.forEach(term => {
      const termRegex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = pageText.match(termRegex);
      
      if (matches) {
        matchedTerms.push(term);
        score += matches.length * (HIGH_VALUE_TERMS.includes(term) ? 2 : 1);
      }
    });
    
    // Boost score if multiple terms match
    if (matchedTerms.length > 1) {
      score *= 1.5;
    }
    
    if (score > 0 && score > highestScore) {
      highestScore = score;
      bestMatch = {
        pageNumber: pageNum,
        confidence: Math.min((score / searchTerms.length) * strategy.confidence, 1),
        matchedTerms
      };
    }
  }
  
  return bestMatch;
};

/**
 * Generate the best search query for an issue (legacy function for compatibility)
 */
export const generateIssueSearchQuery = (issue: InspectionIssue): string => {
  const strategies = generateSearchStrategies(issue);
  return strategies.length > 0 ? strategies[0].query : '';
};
