
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
      return 'bg-green-50 border-green-200';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'bg-yellow-50 border-yellow-200';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const systemEntries = Object.entries(systems).filter(([_, system]) => system);

  if (systemEntries.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Major Systems Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {systemEntries.map(([systemName, system]) => (
            <div key={systemName} className={`p-4 rounded-lg border ${getConditionColor(system.condition)}`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900 capitalize">{systemName}</h4>
                <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded">
                  {system.condition}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-3">{system.summary}</p>
              
              {/* Additional system details */}
              {(system.brand || system.type || system.age || system.yearsLeft || system.replacementCost) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {system.brand && (
                      <div>
                        <span className="font-medium text-gray-600">Brand:</span>
                        <span className="ml-2 text-gray-800">{system.brand}</span>
                      </div>
                    )}
                    {system.type && (
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-800">{system.type}</span>
                      </div>
                    )}
                    {system.age && (
                      <div>
                        <span className="font-medium text-gray-600">Age:</span>
                        <span className="ml-2 text-gray-800">{system.age}</span>
                      </div>
                    )}
                    {system.yearsLeft && (
                      <div>
                        <span className="font-medium text-gray-600">Est. Years Left:</span>
                        <span className="ml-2 text-gray-800">{system.yearsLeft}</span>
                      </div>
                    )}
                    {system.replacementCost && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-600">Est. Replacement Cost:</span>
                        <span className="ml-2 text-gray-800">
                          {formatCurrency(system.replacementCost.min)} - {formatCurrency(system.replacementCost.max)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MajorSystems;
