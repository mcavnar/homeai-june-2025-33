
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyInfoProps {
  address?: string;
  inspectionDate?: string;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ address, inspectionDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {address && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
              <p className="text-gray-700">{address}</p>
            </div>
          )}
          {inspectionDate && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Inspection Date
              </h4>
              <p className="text-gray-700">{inspectionDate}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
