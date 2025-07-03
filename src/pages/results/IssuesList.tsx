
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import DetailedFindings from '@/components/DetailedFindings';

interface IssuesListContextType {
  analysis: any;
}

const IssuesList = () => {
  const { analysis } = useOutletContext<IssuesListContextType>();

  // Debug logging to trace analysis data at page level
  console.log('IssuesList Page - Full analysis object:', analysis);
  console.log('IssuesList Page - analysis.issues:', analysis?.issues);
  console.log('IssuesList Page - issues type:', typeof analysis?.issues);
  console.log('IssuesList Page - issues length:', analysis?.issues?.length);

  if (analysis?.issues && analysis.issues.length > 0) {
    console.log('IssuesList Page - Sample issue keys:', Object.keys(analysis.issues[0] || {}));
    console.log('IssuesList Page - Issues with sourceQuote:', 
      analysis.issues.filter((issue: any) => !!issue.sourceQuote).length);
  }

  // Calculate priority statistics
  const getPriorityStats = () => {
    if (!analysis?.issues || analysis.issues.length === 0) {
      return {
        high: { count: 0, cost: 0 },
        medium: { count: 0, cost: 0 },
        low: { count: 0, cost: 0 }
      };
    }

    const highPriorityIssues = analysis.issues.filter((issue: any) => 
      issue.priority === 'immediate' || issue.priority === 'high'
    );
    const mediumPriorityIssues = analysis.issues.filter((issue: any) => 
      issue.priority === 'medium'
    );
    const lowPriorityIssues = analysis.issues.filter((issue: any) => 
      issue.priority === 'low'
    );

    const highCost = highPriorityIssues.reduce((sum: number, issue: any) => 
      sum + (issue.estimatedCost?.max || 0), 0
    );
    const mediumCost = mediumPriorityIssues.reduce((sum: number, issue: any) => 
      sum + (issue.estimatedCost?.max || 0), 0
    );
    const lowCost = lowPriorityIssues.reduce((sum: number, issue: any) => 
      sum + (issue.estimatedCost?.max || 0), 0
    );

    return {
      high: { count: highPriorityIssues.length, cost: highCost },
      medium: { count: mediumPriorityIssues.length, cost: mediumCost },
      low: { count: lowPriorityIssues.length, cost: lowCost }
    };
  };

  const priorityStats = getPriorityStats();

  if (!analysis.issues || analysis.issues.length === 0) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues List</h1>
          <div className="text-gray-600 text-lg">
            <p>All identified issues with location and estimated repair costs</p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500">No detailed findings available in this report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues List</h1>
        <div className="text-gray-600 text-lg">
          <p>All identified issues with location and estimated repair costs</p>
        </div>
      </div>

      {/* Priority Summary Boxes */}
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {/* High Priority */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-red-700">High Priority</h3>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">
                {priorityStats.high.count}
              </div>
              <div className="text-sm text-red-600">
                {priorityStats.high.count === 1 ? 'Issue' : 'Issues'}
              </div>
              <div className="text-xl font-semibold text-red-700 mt-2">
                {formatCurrency(priorityStats.high.cost)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medium Priority */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-yellow-700">Medium Priority</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {priorityStats.medium.count}
              </div>
              <div className="text-sm text-yellow-600">
                {priorityStats.medium.count === 1 ? 'Issue' : 'Issues'}
              </div>
              <div className="text-xl font-semibold text-yellow-700 mt-2">
                {formatCurrency(priorityStats.medium.cost)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Priority */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-green-700">Low Priority</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {priorityStats.low.count}
              </div>
              <div className="text-sm text-green-600">
                {priorityStats.low.count === 1 ? 'Issue' : 'Issues'}
              </div>
              <div className="text-xl font-semibold text-green-700 mt-2">
                {formatCurrency(priorityStats.low.cost)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailedFindings issues={analysis.issues} />
    </div>
  );
};

export default IssuesList;
