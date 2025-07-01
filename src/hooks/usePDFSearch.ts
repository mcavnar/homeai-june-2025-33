import { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeTextForSearch, findNormalizedIndex } from '@/utils/textNormalization';

interface SearchMatch {
  pageNumber: number;
  textIndex: number;
  text: string;
}

interface PageTextContent {
  pageNumber: number;
  textItems: any[];
  fullText: string;
  normalizedText: string; // Add normalized version
}

export const usePDFSearch = (pdf: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [pageTextContent, setPageTextContent] = useState<Map<number, PageTextContent>>(new Map());
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const textExtractionRef = useRef(false);

  // Extract text content from all pages when PDF loads - only once
  useEffect(() => {
    if (!pdf || textExtractionRef.current) return;

    const extractAllText = async () => {
      console.log('Starting text extraction for search...');
      textExtractionRef.current = true;
      const textContentMap = new Map<number, PageTextContent>();
      
      try {
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const fullText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          // Store both original and normalized text
          textContentMap.set(pageNum, {
            pageNumber: pageNum,
            textItems: textContent.items,
            fullText,
            normalizedText: normalizeTextForSearch(fullText)
          });
        }
        
        setPageTextContent(textContentMap);
        console.log('Text extraction complete for', pdf.numPages, 'pages');
      } catch (error) {
        console.error('Error extracting text for search:', error);
        textExtractionRef.current = false;
      }
    };

    extractAllText();
  }, [pdf?.numPages]);

  // Enhanced search function with normalization
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || pageTextContent.size === 0) {
      setMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    setIsSearching(true);
    const normalizedSearchTerm = normalizeTextForSearch(query);
    const foundMatches: SearchMatch[] = [];

    try {
      for (const [pageNum, content] of pageTextContent.entries()) {
        const { normalizedText } = content;
        
        let searchIndex = 0;
        while (true) {
          const matchIndex = normalizedText.indexOf(normalizedSearchTerm, searchIndex);
          if (matchIndex === -1) break;

          foundMatches.push({
            pageNumber: pageNum,
            textIndex: matchIndex,
            text: normalizedSearchTerm
          });

          searchIndex = matchIndex + 1;
        }
      }

      setMatches(foundMatches);
      setCurrentMatchIndex(foundMatches.length > 0 ? 0 : -1);
      console.log(`Found ${foundMatches.length} matches for "${query}" (normalized: "${normalizedSearchTerm}")`);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsSearching(false);
    }
  }, [pageTextContent]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, [performSearch]);

  const goToNextMatch = useCallback(() => {
    if (matches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    }
  }, [matches.length]);

  const goToPrevMatch = useCallback(() => {
    if (matches.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    }
  }, [matches.length]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setMatches([]);
    setCurrentMatchIndex(-1);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  const getCurrentMatch = useCallback(() => {
    return currentMatchIndex >= 0 ? matches[currentMatchIndex] : null;
  }, [matches, currentMatchIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    matches,
    currentMatchIndex,
    isSearching,
    handleSearch,
    goToNextMatch,
    goToPrevMatch,
    clearSearch,
    getCurrentMatch,
    totalMatches: matches.length
  };
};
