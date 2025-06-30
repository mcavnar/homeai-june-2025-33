import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InspectionIssue } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface MostExpensiveIssuesProps {
  issues: InspectionIssue[];
}

const MostExpensiveIssues: React.FC<MostExpensiveIssuesProps> = ({ issues }) => {
  const navigate = useNavigate();

  // Filter issues that cost $1000+ or get top 3 most expensive
  const getTopIssues = () => {
    // Sort all issues by max cost descending
    const sortedIssues = [...issues].sort((a, b) => b.estimatedCost.max - a.estimatedCost.max);
    
    // Filter issues that cost $1000+
    const expensiveIssues = sortedIssues.filter(issue => issue.estimatedCost.max >= 1000);
    
    // Return all $1000+ issues, or top 3 if none meet threshold
    return expensiveIssues.length > 0 ? expensiveIssues : sortedIssues.slice(0, 3);
  };

  const topIssues = getTopIssues();
  const hasHighCostIssues = issues.some(issue => issue.estimatedCost.max >= 1000);

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

  const handleCompleteListClick = () => {
    navigate('/results/issues');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Most Expensive Issues</CardTitle>
            <CardDescription>
              {hasHighCostIssues 
                ? `All issues with repair costs of $1,000 or more (${topIssues.length} found)`
                : `Top 3 most expensive issues from this inspection`
              }
            </CardDescription>
          </div>
          <Button 
            onClick={handleCompleteListClick}
            variant="outline"
            size="sm"
          >
            Complete Issues List
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topIssues.map((issue, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {renderPriorityBadge(issue.priority)}
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">{issue.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(issue.estimatedCost.min)} - {formatCurrency(issue.estimatedCost.max)}
                  </p>
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
      </CardContent>
    </Card>
  );
};

export default MostExpensiveIssues;
