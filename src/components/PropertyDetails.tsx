
import React from 'react';
import { Home, DollarSign, Calendar, Bed, Square } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RedfinPropertyData } from '@/services/redfinApi';

interface PropertyDetailsProps {
  propertyData: RedfinPropertyData;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyData }) => {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number | null) => {
    if (!num) return 'N/A';
    return num.toLocaleString();
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Home className="h-5 w-5" />
          Property Details
        </CardTitle>
        <CardDescription>Market information and property characteristics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sale History */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Sale History
            </h4>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-700">Last Sold</span>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {propertyData.soldDate || 'N/A'}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(propertyData.soldPrice)}
              </p>
            </div>
          </div>

          {/* Listing History */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Current Listing
            </h4>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-purple-700">Listed</span>
                <span className="text-sm text-purple-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {propertyData.listedDate || 'N/A'}
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(propertyData.listedPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Property Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Bedrooms</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {propertyData.bedrooms ? `${propertyData.bedrooms}` : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Square className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Square Feet</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(propertyData.squareFeet)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
