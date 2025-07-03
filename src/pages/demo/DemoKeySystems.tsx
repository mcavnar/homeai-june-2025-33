
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MajorSystems from '@/components/MajorSystems';

interface DemoKeySystemsContextType {
  analysis: any;
}

const DemoKeySystems = () => {
  const { analysis } = useOutletContext<DemoKeySystemsContextType>();

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
    </div>
  );
};

export default DemoKeySystems;
