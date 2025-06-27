
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';

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
        <div className="grid md:grid-cols-2 gap-4">
          {systemEntries.map(([systemName, system]) => (
            <div key={systemName} className={`p-4 rounded-lg border ${getConditionColor(system.condition)}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900 capitalize">{systemName}</h4>
                <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded">
                  {system.condition}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{system.summary}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MajorSystems;
