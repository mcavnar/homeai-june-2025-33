
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
      <div className="text-center py-12">
        <p className="text-gray-500">No detailed findings available in this report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailedFindings issues={analysis.issues} />
    </div>
  );
};

export default IssuesList;
