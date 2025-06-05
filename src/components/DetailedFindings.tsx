
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InspectionIssue } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface DetailedFindingsProps {
  issues: InspectionIssue[];
}

const DetailedFindings: React.FC<DetailedFindingsProps> = ({ issues }) => {
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
        <CardTitle>Detailed Findings & Cost Estimates</CardTitle>
        <CardDescription>All identified issues with location and estimated repair costs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => (
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

export default DetailedFindings;
