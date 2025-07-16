
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MajorSystems from '@/components/MajorSystems';

interface DemoKeySystemsContextType {
  analysis: any;
}

const DemoKeySystems = () => {
  const { analysis } = useOutletContext<DemoKeySystemsContextType>();
  const navigate = useNavigate();

  const handleUploadReport = () => {
    navigate('/anonymous-upload');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Systems</h1>
        <div className="text-gray-600 text-lg">
          <p>Assessment of major home systems including HVAC, plumbing, and electrical</p>
        </div>
      </div>

      <MajorSystems systems={analysis.majorSystems} />

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

export default DemoKeySystems;
