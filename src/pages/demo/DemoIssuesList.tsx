
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DetailedFindings from '@/components/DetailedFindings';

interface DemoIssuesListContextType {
  analysis: any;
}

const DemoIssuesList = () => {
  const { analysis } = useOutletContext<DemoIssuesListContextType>();
  const navigate = useNavigate();

  const handleUploadReport = () => {
    navigate('/auth');
  };

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

      {/* Upload Report Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleUploadReport}
          variant="green"
          size="lg"
          className="px-8 py-3 text-lg font-medium shadow-lg"
        >
          Upload Your Report For Free
        </Button>
      </div>
    </div>
  );
};

export default DemoIssuesList;
