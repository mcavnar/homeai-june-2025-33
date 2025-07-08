
import React from 'react';
import { useSharedReport } from '@/contexts/SharedReportContext';
import DetailedFindings from '@/components/DetailedFindings';

const SharedIssuesList = () => {
  const { analysis } = useSharedReport();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues List</h1>
        <div className="text-gray-600 text-lg">
          <p>Detailed breakdown of all issues found during inspection</p>
        </div>
      </div>

      <DetailedFindings findings={analysis} />
    </div>
  );
};

export default SharedIssuesList;
