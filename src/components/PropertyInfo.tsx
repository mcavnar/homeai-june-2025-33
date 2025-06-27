
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cleanAddressForDisplay } from '@/utils/addressUtils';

interface PropertyInfoProps {
  address?: string;
  inspectionDate?: string;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ address, inspectionDate }) => {
  const displayAddress = address ? cleanAddressForDisplay(address) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Synopsis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {displayAddress && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
              <p className="text-gray-700">{displayAddress}</p>
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
