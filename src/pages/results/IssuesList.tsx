
import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Filter } from 'lucide-react';
import DetailedFindings from '@/components/DetailedFindings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InspectionIssue } from '@/types/inspection';

interface IssuesListContextType {
  analysis: any;
}

const IssuesList = () => {
  const { analysis } = useOutletContext<IssuesListContextType>();
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');

  const filteredIssues = useMemo(() => {
    if (!analysis.issues || analysis.issues.length === 0) return [];

    return analysis.issues.filter((issue: InspectionIssue) => {
      // Filter by severity
      if (severityFilter !== 'all' && issue.priority !== severityFilter) {
        return false;
      }

      // Filter by type/category
      if (typeFilter !== 'all' && issue.category !== typeFilter) {
        return false;
      }

      // Filter by price range
      if (priceFilter !== 'all') {
        const maxCost = issue.estimatedCost.max;
        switch (priceFilter) {
          case 'low':
            if (maxCost >= 1000) return false;
            break;
          case 'medium':
            if (maxCost < 1000 || maxCost >= 5000) return false;
            break;
          case 'high':
            if (maxCost < 5000) return false;
            break;
        }
      }

      return true;
    });
  }, [analysis.issues, severityFilter, typeFilter, priceFilter]);

  // Get unique categories for the type filter
  const uniqueCategories = useMemo(() => {
    if (!analysis.issues) return [];
    const categories = analysis.issues.map((issue: InspectionIssue) => issue.category);
    return [...new Set(categories)];
  }, [analysis.issues]);

  if (!analysis.issues || analysis.issues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No detailed findings available in this report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
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
              {uniqueCategories.map((category) => (
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

          {(severityFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all') && (
            <button
              onClick={() => {
                setSeverityFilter('all');
                setTypeFilter('all');
                setPriceFilter('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No issues match the selected filters.</p>
        </div>
      ) : (
        <DetailedFindings issues={filteredIssues} />
      )}
    </div>
  );
};

export default IssuesList;
