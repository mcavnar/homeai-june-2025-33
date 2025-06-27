
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  const getConditionColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
      return 'border-green-200 bg-green-50';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'border-yellow-200 bg-yellow-50';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'border-red-200 bg-red-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const getConditionTextColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
      return 'text-green-800 bg-green-100';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'text-yellow-800 bg-yellow-100';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'text-red-800 bg-red-100';
    }
    return 'text-gray-800 bg-gray-100';
  };

  const formatSummaryAsBullets = (summary: string) => {
    // Split by common sentence endings and filter out empty strings
    const sentences = summary
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return sentences;
  };

  const systemEntries = Object.entries(systems).filter(([_, system]) => system);

  if (systemEntries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Major Systems Assessment</h2>
        <p className="text-gray-600">Detailed evaluation of your property's key systems</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemEntries.map(([systemName, system]) => (
          <Card key={systemName} className={`${getConditionColor(system.condition)} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-gray-900 capitalize">
                  {systemName}
                </CardTitle>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getConditionTextColor(system.condition)}`}>
                  {system.condition}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Summary as bullets */}
              <div className="space-y-2">
                {formatSummaryAsBullets(system.summary).map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1.5 text-xs">•</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
              
              {/* System Details */}
              {(system.brand || system.type || system.age || system.yearsLeft) && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">System Details</h4>
                  <div className="space-y-1 text-sm">
                    {system.brand && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="text-gray-900 font-medium">{system.brand}</span>
                      </div>
                    )}
                    {system.type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-gray-900 font-medium">{system.type}</span>
                      </div>
                    )}
                    {system.age && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="text-gray-900 font-medium">{system.age}</span>
                      </div>
                    )}
                    {system.yearsLeft && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Years Left:</span>
                        <span className="text-gray-900 font-medium">{system.yearsLeft}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Replacement Cost */}
              {system.replacementCost && (
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Replacement Cost</h4>
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(system.replacementCost.min)} - {formatCurrency(system.replacementCost.max)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MajorSystems;
