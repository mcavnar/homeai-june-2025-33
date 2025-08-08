
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MajorSystems from '@/components/MajorSystems';

interface KeySystemsContextType {
  analysis: any;
  propertyData?: any;
}

const KeySystems = () => {
  const { analysis, propertyData } = useOutletContext<KeySystemsContextType>();
  
  // Extract property address from various sources
  const extractPropertyAddress = (): string | undefined => {
    // Try property data first
    if (propertyData?.address) return propertyData.address;
    
    // Try analysis data
    const addressFields = [
      analysis?.propertyInfo?.address,
      analysis?.address,
      analysis?.property?.address,
      analysis?.propertyDetails?.address,
      analysis?.location?.address,
    ];

    for (const address of addressFields) {
      if (address && typeof address === 'string') {
        return address;
      }
    }
    return undefined;
  };

  const propertyAddress = extractPropertyAddress();

  if (!analysis.majorSystems) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Systems</h1>
          <div className="text-gray-600 text-lg">
            <p>Assessment of major home systems including HVAC, plumbing, and electrical</p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500">No major systems assessment available in this report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Systems</h1>
        <div className="text-gray-600 text-lg">
          <p>Assessment of major home systems including HVAC, plumbing, and electrical</p>
        </div>
      </div>

      <MajorSystems systems={analysis.majorSystems} propertyAddress={propertyAddress} />
    </div>
  );
};

export default KeySystems;
