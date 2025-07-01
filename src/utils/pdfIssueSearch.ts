
import { InspectionIssue } from '@/types/inspection';
import { normalizeTextForSearch } from './textNormalization';

export const generateIssueSearchQuery = (issue: InspectionIssue): string => {
  // If we have a source quote, use it (it will be normalized during search)
  if (issue.sourceQuote) {
    return issue.sourceQuote;
  }

  // Fallback: create a search query from description and location
  const searchTerms = [
    issue.description,
    issue.location,
    issue.category
  ];

  // Extract key terms and create a focused search query
  const keyTerms = searchTerms
    .join(' ')
    .split(' ')
    .filter(term => term.length > 3) // Only include meaningful terms
    .slice(0, 5) // Limit to first 5 terms to avoid overly long queries
    .join(' ');

  return keyTerms || issue.description.substring(0, 50);
};

/**
 * Enhanced search query generation that handles text normalization
 */
export const generateNormalizedSearchQuery = (issue: InspectionIssue): string => {
  const query = generateIssueSearchQuery(issue);
  // The normalization will happen in the search hook, so we return the original query
  // but this function can be used if we need to normalize queries elsewhere
  return query;
};
