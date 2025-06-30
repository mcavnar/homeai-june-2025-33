
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  RotateCcw,
  Search,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { pdfjsLib } from '@/utils/pdfConfig';
import { usePDFSearch } from '@/hooks/usePDFSearch';

interface PDFViewerProps {
  pdfArrayBuffer: ArrayBuffer;
  initialSearchQuery?: string;
}

const PDFViewer = forwardRef<any, PDFViewerProps>(({ pdfArrayBuffer, initialSearchQuery }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);

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

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfArrayBuffer || pdfArrayBuffer.byteLength === 0) {
        console.error('PDFViewer: Invalid or empty ArrayBuffer provided');
        setError('Invalid PDF data provided');
        setLoading(false);
        return;
      }

      try {
        console.log('PDFViewer: Loading PDF from ArrayBuffer, size:', pdfArrayBuffer.byteLength);
        setLoading(true);
        setError('');
        
        const loadedPdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        console.log('PDFViewer: PDF loaded successfully, pages:', loadedPdf.numPages);
      } catch (err) {
        console.error('PDFViewer: Error loading PDF:', err);
        setError('Failed to load PDF document');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfArrayBuffer]);

  // Render page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        console.log('PDFViewer: Rendering page', currentPage);
        
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        console.log('PDFViewer: Page rendered successfully');
      } catch (err) {
        console.error('PDFViewer: Error rendering page:', err);
        setError('Failed to render PDF page');
      }
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  // Auto-navigate to current match page
  useEffect(() => {
    const currentMatch = getCurrentMatch();
    if (currentMatch && currentMatch.pageNumber !== currentPage) {
      setCurrentPage(currentMatch.pageNumber);
    }
  }, [currentMatchIndex, getCurrentMatch, currentPage]);

  // Handle initial search query
  useEffect(() => {
    if (initialSearchQuery && pdf && !showSearch) {
      console.log('PDFViewer: Setting initial search query:', initialSearchQuery);
      setShowSearch(true);
      handleSearch(initialSearchQuery);
    }
  }, [initialSearchQuery, pdf, handleSearch, showSearch]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.2);
  };

  const fitToWidth = () => {
    if (canvasRef.current) {
      const containerWidth = canvasRef.current.parentElement?.clientWidth || 800;
      setScale((containerWidth - 40) / 612);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      clearSearch();
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading PDF</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      {/* Controls Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={showSearch ? "default" : "outline"} 
            size="sm" 
            onClick={toggleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={fitToWidth}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in PDF..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {totalMatches > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {currentMatchIndex + 1} of {totalMatches}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevMatch}
                    disabled={totalMatches === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextMatch}
                    disabled={totalMatches === 0}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {isSearching && (
              <div className="text-sm text-gray-600">Searching...</div>
            )}
          </div>
        </div>
      )}

      {/* PDF Content */}
      <ScrollArea className="h-[700px] w-full">
        <div className="flex justify-center p-6 bg-gray-100 min-h-full">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border shadow-lg bg-white"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
});

PDFViewer.displayName = 'PDFViewer';

export default PDFViewer;
