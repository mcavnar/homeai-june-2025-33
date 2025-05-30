
import React from 'react';
import { Home, DollarSign, Calendar, Bed, Square } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RedfinPropertyData } from '@/services/redfinApi';
import { formatCurrency, formatNumber, formatPercentage, calculateDaysOnMarket, calculateSaleToListRatio } from '@/utils/formatters';
import MarketCompData from './MarketCompData';

interface PropertyDetailsProps {
  propertyData: RedfinPropertyData;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyData }) => {
  const saleToListRatio = calculateSaleToListRatio(propertyData.soldPrice, propertyData.listedPrice);
  const daysOnMarket = calculateDaysOnMarket(propertyData.soldDate, propertyData.listedDate);

  return (
    <div className="space-y-6">
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
            {/* Sale Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Sale Information
              </h4>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-green-700">Sale Price</span>
                    <p className="text-xl font-bold text-green-900">
                      {formatCurrency(propertyData.soldPrice)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Sale Date
                    </span>
                    <p className="text-sm font-medium text-green-800">
                      {propertyData.soldDate || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Listing Information
              </h4>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-purple-700">Listing Price</span>
                    <p className="text-xl font-bold text-purple-900">
                      {formatCurrency(propertyData.listedPrice)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-purple-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Listing Date
                    </span>
                    <p className="text-sm font-medium text-purple-800">
                      {propertyData.listedDate || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Metrics */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Market Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Sale-to-List Ratio</span>
                <p className="text-lg font-semibold text-blue-900">
                  {formatPercentage(saleToListRatio)}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-indigo-700">Days on Market</span>
                <p className="text-lg font-semibold text-indigo-900">
                  {daysOnMarket ? `${daysOnMarket} days` : 'N/A'}
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

      {/* Market Comp Data Section */}
      <MarketCompData
        neighborhoodAvgDaysOnMarket={propertyData.neighborhoodAvgDaysOnMarket}
        neighborhoodAvgSaleToListRatio={propertyData.neighborhoodAvgSaleToListRatio}
        nearbyHomesAvgSquareFeet={propertyData.nearbyHomesAvgSquareFeet}
      />
    </div>
  );
};

export default PropertyDetails;
