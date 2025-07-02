
import { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeTextForSearch } from '@/utils/textNormalization';
import { performMultiStrategySearch, FlexibleMatch } from '@/utils/flexibleSearch';

interface SearchMatch {
  pageNumber: number;
  textIndex: number;
  text: string;
  strategy?: 'exact' | 'normalized' | 'flexible';
  confidence?: number;
}

interface PageTextContent {
  pageNumber: number;
  textItems: any[];
  fullText: string;
  normalizedText: string;
}

export const usePDFSearch = (pdf: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [pageTextContent, setPageTextContent] = useState<Map<number, PageTextContent>>(new Map());
  const [textExtractionComplete, setTextExtractionComplete] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const textExtractionRef = useRef(false);

  // Extract text content from all pages when PDF loads - only once
  useEffect(() => {
    if (!pdf || textExtractionRef.current) return;

    const extractAllText = async () => {
      console.log('Starting text extraction for search...');
      textExtractionRef.current = true;
      setTextExtractionComplete(false);
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
        setTextExtractionComplete(true);
        console.log('Text extraction complete for', pdf.numPages, 'pages');
      } catch (error) {
        console.error('Error extracting text for search:', error);
        textExtractionRef.current = false;
        setTextExtractionComplete(false);
      }
    };

    extractAllText();
  }, [pdf?.numPages]);

  // Enhanced search function with multi-strategy approach
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || pageTextContent.size === 0) {
      setMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    setIsSearching(true);
    const foundMatches: SearchMatch[] = [];

    try {
      console.log(`Starting multi-strategy search for: "${query}"`);
      
      for (const [pageNum, content] of pageTextContent.entries()) {
        const pageMatches = performMultiStrategySearch(
          content.fullText,
          query,
          pageNum
        );
        
        // Convert FlexibleMatch to SearchMatch format
        const convertedMatches = pageMatches.map((match: FlexibleMatch): SearchMatch => ({
          pageNumber: match.pageNumber,
          textIndex: match.textIndex,
          text: match.text,
          strategy: match.strategy,
          confidence: match.confidence
        }));
        
        foundMatches.push(...convertedMatches);
        
        if (pageMatches.length > 0) {
          console.log(`Page ${pageNum}: Found ${pageMatches.length} matches using ${pageMatches[0].strategy} strategy`);
        }
      }

      // Sort all matches by confidence
      foundMatches.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

      setMatches(foundMatches);
      setCurrentMatchIndex(foundMatches.length > 0 ? 0 : -1);
      
      console.log(`Multi-strategy search complete: ${foundMatches.length} total matches`);
      if (foundMatches.length > 0) {
        console.log(`Best match strategy: ${foundMatches[0].strategy}, confidence: ${foundMatches[0].confidence}`);
      }
    } catch (error) {
      console.error('Error performing multi-strategy search:', error);
    } finally {
      setIsSearching(false);
    }
  }, [pageTextContent]);

  // Immediate search function that bypasses debounce
  const executeSearchImmediately = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    console.log('Executing immediate search for:', query);
    setSearchQuery(query);
    await performSearch(query);
  }, [performSearch]);

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
    textExtractionComplete,
    handleSearch,
    executeSearchImmediately,
    goToNextMatch,
    goToPrevMatch,
    clearSearch,
    getCurrentMatch,
    totalMatches: matches.length
  };
};
