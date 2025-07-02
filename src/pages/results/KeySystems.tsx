
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MajorSystems from '@/components/MajorSystems';

interface KeySystemsContextType {
  analysis: any;
}

const KeySystems = () => {
  const { analysis } = useOutletContext<KeySystemsContextType>();

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

      <MajorSystems systems={analysis.majorSystems} />
    </div>
  );
};

export default KeySystems;
