
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AtAGlance from '@/components/AtAGlance';
import ModernStepper from '@/components/ModernStepper';
import MostExpensiveIssues from '@/components/MostExpensiveIssues';
import { cleanAddressForDisplay } from '@/utils/addressUtils';

interface DemoSynopsisContextType {
  analysis: any;
  propertyData: any;
}

const DemoSynopsis = () => {
  const { analysis, propertyData } = useOutletContext<DemoSynopsisContextType>();
  const navigate = useNavigate();

  const displayAddress = analysis.propertyInfo?.address 
    ? cleanAddressForDisplay(analysis.propertyInfo.address) 
    : undefined;

  const handleUploadReport = () => {
    navigate('/auth');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <div className="text-gray-600 text-lg">
          {displayAddress && analysis.propertyInfo?.inspectionDate ? (
            <p>{displayAddress} • Inspection Date: {analysis.propertyInfo.inspectionDate}</p>
          ) : displayAddress ? (
            <p>{displayAddress}</p>
          ) : analysis.propertyInfo?.inspectionDate ? (
            <p>Inspection Date: {analysis.propertyInfo.inspectionDate}</p>
          ) : null}
        </div>
      </div>

      {/* At a Glance Section */}
      <AtAGlance analysis={analysis} propertyData={propertyData} />

      {/* Upload Report Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleUploadReport}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-medium shadow-lg"
          size="lg"
        >
          Upload Your Report For Free
        </Button>
      </div>

      {/* Modern Stepper Next Steps */}
      <ModernStepper />

      {/* Most Expensive Issues Section */}
      {analysis.issues && analysis.issues.length > 0 && (
        <MostExpensiveIssues issues={analysis.issues} />
      )}
    </div>
  );
};

export default DemoSynopsis;
