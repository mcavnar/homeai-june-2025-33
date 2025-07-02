import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { InspectionIssue } from '@/types/inspection';
import { generateIssueSearchQuery } from '@/utils/pdfIssueSearch';
import IssueFilters from './IssueFilters';
import IssueCard from './IssueCard';

interface IssuesListProps {
  issues: InspectionIssue[];
}

const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  // Debug logging to trace issues data
  console.log('IssuesList - Raw issues array:', issues);
  console.log('IssuesList - Issues count:', issues?.length || 0);
  
  if (issues && issues.length > 0) {
    console.log('IssuesList - First few issues with sourceQuote check:');
    issues.slice(0, 3).forEach((issue, index) => {
      console.log(`  Issue ${index}:`, {
        description: issue.description?.substring(0, 50) + '...',
        hasSourceQuote: !!issue.sourceQuote,
        sourceQuote: issue.sourceQuote?.substring(0, 100) + (issue.sourceQuote?.length > 100 ? '...' : ''),
        allKeys: Object.keys(issue)
      });
    });
  }

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuotes, setExpandedQuotes] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleQuoteExpansion = (index: number) => {
    const newExpanded = new Set(expandedQuotes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuotes(newExpanded);
  };

  const filteredIssues = useMemo(() => {
    if (!issues || issues.length === 0) return [];

    const filtered = issues.filter((issue: InspectionIssue) => {
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesDescription = issue.description.toLowerCase().includes(query);
        const matchesLocation = issue.location.toLowerCase().includes(query);
        if (!matchesDescription && !matchesLocation) {
          return false;
        }
      }

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

    console.log('IssuesList - Filtered issues:', filtered.length);
    console.log('IssuesList - Filtered issues with sourceQuote:', 
      filtered.filter(issue => !!issue.sourceQuote).length);

    return filtered;
  }, [issues, severityFilter, typeFilter, priceFilter, searchQuery]);

  // Get unique categories for the type filter
  const uniqueCategories = useMemo(() => {
    if (!issues) return [];
    const categories = issues
      .map((issue: InspectionIssue) => issue.category)
      .filter((category: string) => typeof category === 'string');
    return [...new Set(categories)] as string[];
  }, [issues]);

  const handleSeeInReport = (issue: InspectionIssue) => {
    // Use source quote if available, otherwise fall back to generated search query
    const searchQuery = issue.sourceQuote || generateIssueSearchQuery(issue);
    
    // Navigate to the report with search context
    navigate('/results/report', { 
      state: { 
        searchQuery,
        issueDescription: issue.description,
        issueLocation: issue.location
      }
    });
    
    // Update toast message based on search type
    const searchType = issue.sourceQuote ? "inspector's original notes" : "issue details";
    toast({
      title: "Navigated to Inspection Report",
      description: `Searching for ${searchType} in the ${issue.location} section`,
    });
  };

  const exportToCSV = () => {
    if (filteredIssues.length === 0) return;

    const headers = ['Description', 'Location', 'Priority', 'Category', 'Min Cost', 'Max Cost'];
    const csvContent = [
      headers.join(','),
      ...filteredIssues.map(issue => [
        `"${issue.description.replace(/"/g, '""')}"`,
        `"${issue.location.replace(/"/g, '""')}"`,
        issue.priority,
        issue.category,
        issue.estimatedCost.min,
        issue.estimatedCost.max
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inspection-issues.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setSeverityFilter('all');
    setTypeFilter('all');
    setPriceFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = severityFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div>
      <IssueFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        uniqueCategories={uniqueCategories}
        onClearFilters={handleClearFilters}
        onExportCSV={exportToCSV}
        hasActiveFilters={hasActiveFilters}
        filteredIssuesCount={filteredIssues.length}
      />

      {/* Results */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No issues match the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              index={index}
              isQuoteExpanded={expandedQuotes.has(index)}
              onToggleQuote={toggleQuoteExpansion}
              onSeeInReport={handleSeeInReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesList;
