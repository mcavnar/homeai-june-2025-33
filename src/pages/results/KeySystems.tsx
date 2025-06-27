
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
      <div className="text-center py-12">
        <p className="text-gray-500">No major systems assessment available in this report.</p>
      </div>
    );
  }

  return (
    <div>
      <MajorSystems systems={analysis.majorSystems} />
    </div>
  );
};

export default KeySystems;
