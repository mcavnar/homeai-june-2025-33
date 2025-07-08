
import React from 'react';
import { TrackedButton } from '@/components/TrackedButton';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  RotateCcw,
  Search
} from 'lucide-react';

interface PDFControlsProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  showSearch: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToWidth: () => void;
  onToggleSearch: () => void;
}

const PDFControls = ({
  currentPage,
  totalPages,
  scale,
  showSearch,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToWidth,
  onToggleSearch
}: PDFControlsProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <TrackedButton
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            trackingLabel={`PDF Navigation - Previous Page (${currentPage})`}
          >
            <ChevronLeft className="h-4 w-4" />
          </TrackedButton>
          <TrackedButton
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            trackingLabel={`PDF Navigation - Next Page (${currentPage})`}
          >
            <ChevronRight className="h-4 w-4" />
          </TrackedButton>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <TrackedButton 
          variant={showSearch ? "default" : "outline"} 
          size="sm" 
          onClick={onToggleSearch}
          trackingLabel={`PDF Search - ${showSearch ? 'Hide' : 'Show'} Search`}
        >
          <Search className="h-4 w-4" />
        </TrackedButton>
        <TrackedButton 
          variant="outline" 
          size="sm" 
          onClick={onZoomOut}
          trackingLabel={`PDF Zoom - Zoom Out (${Math.round(scale * 100)}%)`}
        >
          <ZoomOut className="h-4 w-4" />
        </TrackedButton>
        <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <TrackedButton 
          variant="outline" 
          size="sm" 
          onClick={onZoomIn}
          trackingLabel={`PDF Zoom - Zoom In (${Math.round(scale * 100)}%)`}
        >
          <ZoomIn className="h-4 w-4" />
        </TrackedButton>
        <TrackedButton 
          variant="outline" 
          size="sm" 
          onClick={onResetZoom}
          trackingLabel={`PDF Zoom - Reset Zoom (${Math.round(scale * 100)}%)`}
        >
          <RotateCcw className="h-4 w-4" />
        </TrackedButton>
        <TrackedButton 
          variant="outline" 
          size="sm" 
          onClick={onFitToWidth}
          trackingLabel="PDF Zoom - Fit to Width"
        >
          <Maximize2 className="h-4 w-4" />
        </TrackedButton>
      </div>
    </div>
  );
};

export default PDFControls;
