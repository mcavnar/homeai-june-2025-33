
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DetailedFindings from '@/components/DetailedFindings';

interface IssuesListContextType {
  analysis: any;
}

const IssuesList = () => {
  const { analysis } = useOutletContext<IssuesListContextType>();

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
