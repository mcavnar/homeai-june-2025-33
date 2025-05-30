
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MajorSystemsProps {
  systems: {
    roof?: string;
    foundation?: string;
    electrical?: string;
    plumbing?: string;
    hvac?: string;
  };
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Major Systems Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(systems).map(([system, finding]) => (
            finding && (
              <div key={system} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 capitalize mb-2">{system}</h4>
                <p className="text-gray-700 text-sm">{finding}</p>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MajorSystems;
