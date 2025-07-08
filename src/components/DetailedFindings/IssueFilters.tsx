
import React from 'react';
import { Filter, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TrackedButton } from '@/components/TrackedButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IssueFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  severityFilter: string;
  setSeverityFilter: (filter: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  priceFilter: string;
  setPriceFilter: (filter: string) => void;
  uniqueCategories: string[];
  onClearFilters: () => void;
  onExportCSV: () => void;
  hasActiveFilters: boolean;
  filteredIssuesCount: number;
}

const IssueFilters: React.FC<IssueFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
  typeFilter,
  setTypeFilter,
  priceFilter,
  setPriceFilter,
  uniqueCategories,
  onClearFilters,
  onExportCSV,
  hasActiveFilters,
  filteredIssuesCount,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg border p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="immediate">Immediate Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueCategories.map((category: string) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="low">Under $1,000</SelectItem>
              <SelectItem value="medium">$1,000 - $5,000</SelectItem>
              <SelectItem value="high">Over $5,000</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        <TrackedButton 
          onClick={onExportCSV}
          variant="green"
          size="sm"
          className="flex items-center gap-2"
          disabled={filteredIssuesCount === 0}
          trackingLabel={`Export Issues List - ${filteredIssuesCount} issues`}
        >
          <Download className="h-4 w-4" />
          Export List
        </TrackedButton>
      </div>
    </div>
  );
};

export default IssueFilters;
