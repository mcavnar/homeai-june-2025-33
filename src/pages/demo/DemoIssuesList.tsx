
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DetailedFindings from '@/components/DetailedFindings';

interface DemoIssuesListContextType {
  analysis: any;
}

const DemoIssuesList = () => {
  const { analysis } = useOutletContext<DemoIssuesListContextType>();

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

export default DemoIssuesList;
