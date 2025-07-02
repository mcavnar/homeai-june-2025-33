
import React from 'react';
import { MapPin, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { InspectionIssue } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface IssueCardProps {
  issue: InspectionIssue;
  index: number;
  isQuoteExpanded: boolean;
  onToggleQuote: (index: number) => void;
  onSeeInReport: (issue: InspectionIssue) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  index,
  isQuoteExpanded,
  onToggleQuote,
  onSeeInReport,
}) => {
  // Debug logging to trace sourceQuote data
  console.log(`IssueCard ${index} - Full issue object:`, issue);
  console.log(`IssueCard ${index} - sourceQuote value:`, issue.sourceQuote);
  console.log(`IssueCard ${index} - sourceQuote type:`, typeof issue.sourceQuote);
  console.log(`IssueCard ${index} - Has sourceQuote:`, !!issue.sourceQuote);

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
    <div className="p-4 border rounded-lg bg-gray-50">
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
            onClick={() => onSeeInReport(issue)}
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
      <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
        <MapPin className="h-3 w-3" />
        {issue.location}
      </p>

      {/* Source Quote Section */}
      {issue.sourceQuote && (
        <Collapsible 
          open={isQuoteExpanded} 
          onOpenChange={() => onToggleQuote(index)}
        >
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <span>View Inspector's Notes</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isQuoteExpanded ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800 italic leading-relaxed">
                "{issue.sourceQuote}"
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default IssueCard;
