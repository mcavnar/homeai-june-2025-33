
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface SystemSpecsProps {
  type?: string;
  age?: string;
  yearsLeft?: string;
  replacementCost?: {
    min: number;
    max: number;
  };
}

const SystemSpecs: React.FC<SystemSpecsProps> = ({
  type,
  age,
  yearsLeft,
  replacementCost
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">System Details</h4>
      <div className="space-y-3">
        {/* Type - Full Width - Always shown */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
          <span className="text-sm text-gray-900 font-medium">{type || '-'}</span>
        </div>
        
        {/* Age and Years Left - Two Columns - Always shown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</span>
            <span className="text-sm text-gray-900 font-medium">{age || '-'}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Years Left</span>
            <span className="text-sm text-gray-900 font-medium">{yearsLeft || '-'}</span>
          </div>
        </div>
        
        {/* Replacement Cost - Full Width - Always shown */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Replacement Cost</span>
          <span className="text-sm text-gray-900 font-semibold">
            {replacementCost ? 
              `${formatCurrency(replacementCost.min)} - ${formatCurrency(replacementCost.max)}` : 
              '-'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemSpecs;
