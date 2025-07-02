
import React from 'react';
import { useOutletContext } from 'react-router-dom';
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

      <DetailedFindings issues={analysis.issues} />
    </div>
  );
};

export default IssuesList;
