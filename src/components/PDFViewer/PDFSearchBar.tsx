
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface PDFSearchBarProps {
  searchQuery: string;
  totalMatches: number;
  currentMatchIndex: number;
  isSearching: boolean;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onNextMatch: () => void;
  onPrevMatch: () => void;
}

const PDFSearchBar = ({
  searchQuery,
  totalMatches,
  currentMatchIndex,
  isSearching,
  onSearch,
  onClearSearch,
  onNextMatch,
  onPrevMatch
}: PDFSearchBarProps) => {
  return (
    <div className="p-4 border-b bg-blue-50">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search in PDF..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSearch}
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
                onClick={onPrevMatch}
                disabled={totalMatches === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextMatch}
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
  );
};

export default PDFSearchBar;
