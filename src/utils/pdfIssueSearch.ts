
import { InspectionIssue } from '@/types/inspection';

export interface IssueSearchResult {
  pageNumber: number;
  confidence: number;
  matchedTerms: string[];
  searchTerms: string[];
}

/**
 * Extract relevant search terms from an inspection issue
 */
export const extractIssueSearchTerms = (issue: InspectionIssue): string[] => {
  const terms: string[] = [];
  
  // Add location terms
  const locationTerms = issue.location.toLowerCase().split(/[\s,]+/).filter(term => term.length > 2);
  terms.push(...locationTerms);
  
  // Add key terms from description
  const description = issue.description.toLowerCase();
  
  // Common issue-related keywords to extract
  const keywordPatterns = [
    /water\s+damage/g,
    /moisture/g,
    /leak/g,
    /crack/g,
    /damage/g,
    /repair/g,
    /replace/g,
    /missing/g,
    /broken/g,
    /worn/g,
    /deteriorat/g,
    /corroded?/g,
    /rust/g,
    /mold/g,
    /electrical/g,
    /plumbing/g,
    /hvac/g,
    /roof/g,
    /foundation/g,
    /insulation/g,
    /window/g,
    /door/g,
    /floor/g,
    /wall/g,
    /ceiling/g,
    /outlet/g,
    /switch/g,
    /fixture/g,
    /pipe/g,
    /valve/g,
    /vent/g,
    /duct/g,
    /filter/g,
    /shingle/g,
    /gutter/g,
    /siding/g,
    /paint/g,
    /caulk/g,
    /seal/g,
    /trim/g,
    /hardware/g,
    /safety/g,
    /carbon\s+monoxide/g,
    /smoke\s+detector/g,
    /gfci/g,
    /grounding/g
  ];
  
  keywordPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      terms.push(...matches.map(match => match.replace(/\s+/g, ' ').trim()));
    }
  });
  
  // Add category-based terms
  const categoryTerms = issue.category.toLowerCase().split(/[\s,]+/).filter(term => term.length > 2);
  terms.push(...categoryTerms);
  
  // Remove duplicates and short terms
  return [...new Set(terms)].filter(term => term.length > 2);
};

/**
 * Search for an issue in PDF text content and return the best matching page
 */
export const findIssueInPDF = (
  issue: InspectionIssue,
  pageTextContent: Map<number, { pageNumber: number; fullText: string }>
): IssueSearchResult | null => {
  const searchTerms = extractIssueSearchTerms(issue);
  if (searchTerms.length === 0) return null;
  
  let bestMatch: IssueSearchResult | null = null;
  let highestScore = 0;
  
  for (const [pageNum, content] of pageTextContent.entries()) {
    const pageText = content.fullText.toLowerCase();
    const matchedTerms: string[] = [];
    let score = 0;
    
    // Check each search term
    searchTerms.forEach(term => {
      const termRegex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = pageText.match(termRegex);
      
      if (matches) {
        matchedTerms.push(term);
        
        // Score based on term importance and frequency
        let termScore = matches.length;
        
        // Boost score for location matches
        if (issue.location.toLowerCase().includes(term)) {
          termScore *= 2;
        }
        
        // Boost score for exact phrase matches
        if (term.includes(' ')) {
          termScore *= 1.5;
        }
        
        // Boost score for important keywords
        const importantKeywords = ['water', 'damage', 'leak', 'crack', 'safety', 'electrical', 'plumbing'];
        if (importantKeywords.some(keyword => term.includes(keyword))) {
          termScore *= 1.3;
        }
        
        score += termScore;
      }
    });
    
    if (score > 0 && score > highestScore) {
      highestScore = score;
      bestMatch = {
        pageNumber: pageNum,
        confidence: Math.min(score / searchTerms.length, 1),
        matchedTerms,
        searchTerms
      };
    }
  }
  
  return bestMatch;
};

/**
 * Generate search query for an issue that can be used in the PDF search
 */
export const generateIssueSearchQuery = (issue: InspectionIssue): string => {
  const terms = extractIssueSearchTerms(issue);
  
  // Prioritize location and key descriptive terms
  const prioritizedTerms = terms.slice(0, 3);
  
  return prioritizedTerms.join(' ');
};
