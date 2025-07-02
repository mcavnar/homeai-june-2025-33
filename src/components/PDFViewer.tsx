
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { usePDFSearch } from '@/hooks/usePDFSearch';
import { usePDFLoader } from '@/hooks/usePDFLoader';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import PDFControls from './PDFViewer/PDFControls';
import PDFSearchBar from './PDFViewer/PDFSearchBar';
import PDFCanvas from './PDFViewer/PDFCanvas';
import PDFLoadingState from './PDFViewer/PDFLoadingState';
import PDFErrorState from './PDFViewer/PDFErrorState';

interface PDFViewerProps {
  pdfArrayBuffer: ArrayBuffer;
  initialSearchQuery?: string;
}

const PDFViewer = forwardRef<any, PDFViewerProps>(({ pdfArrayBuffer, initialSearchQuery }, ref) => {
  const [showSearch, setShowSearch] = useState(false);
  const [initialSearchExecuted, setInitialSearchExecuted] = useState(false);

  // Load PDF
  const { pdf, totalPages, loading, error } = usePDFLoader(pdfArrayBuffer);

  // Render PDF pages
  const {
    canvasRef,
    currentPage,
    scale,
    setCurrentPage,
    goToPrevPage,
    goToNextPage,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToWidth
  } = usePDFRenderer(pdf);

  // Search functionality
  const {
    searchQuery,
    matches,
    currentMatchIndex,
    isSearching,
    handleSearch,
    goToNextMatch,
    goToPrevMatch,
    clearSearch,
    getCurrentMatch,
    totalMatches
  } = usePDFSearch(pdf);

  useImperativeHandle(ref, () => ({
    search: handleSearch,
    clearSearch
  }), [handleSearch, clearSearch]);

  // Handle initial search query - Fixed timing issue
  useEffect(() => {
    if (initialSearchQuery && pdf && !initialSearchExecuted) {
      console.log('PDFViewer: Executing initial search for:', initialSearchQuery);
      setShowSearch(true);
      // Use setTimeout to ensure the search UI is ready
      setTimeout(() => {
        handleSearch(initialSearchQuery);
        setInitialSearchExecuted(true);
      }, 100);
    }
  }, [initialSearchQuery, pdf, handleSearch, initialSearchExecuted]);

  // Reset initial search flag when initialSearchQuery changes
  useEffect(() => {
    if (initialSearchQuery) {
      setInitialSearchExecuted(false);
    }
  }, [initialSearchQuery]);

  // Auto-navigate to current match page
  useEffect(() => {
    const currentMatch = getCurrentMatch();
    if (currentMatch && currentMatch.pageNumber !== currentPage) {
      setCurrentPage(currentMatch.pageNumber);
    }
  }, [currentMatchIndex, getCurrentMatch, currentPage, setCurrentPage]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      clearSearch();
    }
  };

  if (loading) {
    return <PDFLoadingState />;
  }

  if (error) {
    return <PDFErrorState error={error} />;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <PDFControls
        currentPage={currentPage}
        totalPages={totalPages}
        scale={scale}
        showSearch={showSearch}
        onPrevPage={() => goToPrevPage(totalPages)}
        onNextPage={() => goToNextPage(totalPages)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onFitToWidth={fitToWidth}
        onToggleSearch={toggleSearch}
      />

      {showSearch && (
        <PDFSearchBar
          searchQuery={searchQuery}
          totalMatches={totalMatches}
          currentMatchIndex={currentMatchIndex}
          isSearching={isSearching}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onNextMatch={goToNextMatch}
          onPrevMatch={goToPrevMatch}
        />
      )}

      <PDFCanvas canvasRef={canvasRef} />
    </div>
  );
});

PDFViewer.displayName = 'PDFViewer';

export default PDFViewer;
