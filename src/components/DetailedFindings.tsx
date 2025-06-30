import React, { useState, useMemo } from 'react';
import { MapPin, Filter, Download, FileText, Search, ChevronDown, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from '@/hooks/use-toast';
import { InspectionIssue } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface DetailedFindingsProps {
  issues: InspectionIssue[];
}

const DetailedFindings: React.FC<DetailedFindingsProps> = ({ issues }) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShareAccess = () => {
    const currentUrl = window.location.origin + '/results/issues';
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Issues list page link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually from your browser.",
        variant: "destructive",
      });
    });
  };

  const filteredIssues = useMemo(() => {
    if (!issues || issues.length === 0) return [];

    return issues.filter((issue: InspectionIssue) => {
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
    navigate('/results/report');
    toast({
      title: "Navigated to Inspection Report",
      description: `Look for: "${issue.description}" in the ${issue.location} section`,
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

  const renderPriorityBadge = (priority: 'immediate' | 'high' | 'medium' | 'low') => {
    const colors = {
      immediate: 'bg-red-200 text-red-900 border-red-300',
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    const labels = {
      immediate: 'Immediate Priority',
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${colors[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle>Detailed Issues List</CardTitle>
            <CardDescription>All identified issues with location and estimated repair costs</CardDescription>
          </div>
          <Button 
            onClick={handleShareAccess}
            variant="green"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
        
        {/* Collapsible Analysis Information */}
        <Collapsible open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full mt-4 p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-semibold text-blue-900 text-sm">How Do We Analyze Your Issues?</h4>
            <ChevronDown className={`h-4 w-4 text-blue-900 transition-transform duration-200 ${isAnalysisOpen ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2">
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <span className="font-medium">• Priority Classification:</span>
                  <span className="ml-1">Issues are ranked based on safety impact, potential for damage progression, and urgency of repair needs</span>
                </div>
                
                <div>
                  <span className="font-medium">• Cost Estimation:</span>
                  <span className="ml-1">Repair costs are estimated using current market rates, material costs, labor requirements, and regional pricing data</span>
                </div>
                
                <div>
                  <span className="font-medium">• Original Report Reference:</span>
                  <span className="ml-1">Click "See in Report" on any item to view the original inspector's detailed findings and photos in the full PDF report</span>
                </div>
                
                <div>
                  <span className="font-medium">• Professional Validation:</span>
                  <span className="ml-1">While our analysis provides helpful estimates, always consult qualified contractors for final pricing and repair specifications</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      <CardContent>
        {/* Filter Bar */}
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

              {(severityFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all' || searchQuery.trim() !== '') && (
                <button
                  onClick={() => {
                    setSeverityFilter('all');
                    setTypeFilter('all');
                    setPriceFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <Button 
              onClick={exportToCSV}
              variant="green"
              size="sm"
              className="flex items-center gap-2"
              disabled={filteredIssues.length === 0}
            >
              <Download className="h-4 w-4" />
              Export List
            </Button>
          </div>
        </div>

        {/* Results */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No issues match the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {renderPriorityBadge(issue.priority)}
                    <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">{issue.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(issue.estimatedCost.min)} - {formatCurrency(issue.estimatedCost.max)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleSeeInReport(issue)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="h-4 w-4" />
                      See in Report
                    </Button>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{issue.description}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {issue.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailedFindings;
