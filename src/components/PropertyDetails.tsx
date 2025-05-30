
import React from 'react';
import { Home, DollarSign, Calendar, Bed, Square, TrendingUp, Clock } from 'lucide-react';
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

  const calculateSaleToListRatio = () => {
    if (!propertyData.soldPrice || !propertyData.listedPrice) return 'N/A';
    const ratio = (propertyData.soldPrice / propertyData.listedPrice) * 100;
    return `${ratio.toFixed(1)}%`;
  };

  const calculateDaysOnMarket = () => {
    if (!propertyData.soldDate || !propertyData.listedDate) return 'N/A';
    
    // Parse dates from strings back to Date objects for calculation
    const saleDate = new Date(propertyData.soldDate);
    const listDate = new Date(propertyData.listedDate);
    
    if (isNaN(saleDate.getTime()) || isNaN(listDate.getTime())) return 'N/A';
    
    const diffTime = saleDate.getTime() - listDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} days` : 'N/A';
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Sale Price */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Sale Price</span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(propertyData.soldPrice)}
            </p>
          </div>

          {/* Listing Price */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Listing Price</span>
            </div>
            <p className="text-lg font-bold text-purple-900">
              {formatCurrency(propertyData.listedPrice)}
            </p>
          </div>

          {/* Sale Date */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Sale Date</span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              {propertyData.soldDate || 'N/A'}
            </p>
          </div>

          {/* Listing Date */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Listing Date</span>
            </div>
            <p className="text-lg font-bold text-orange-900">
              {propertyData.listedDate || 'N/A'}
            </p>
          </div>
        </div>

        {/* Market Metrics */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Sale-to-List Ratio</span>
            </div>
            <p className="text-lg font-bold text-indigo-900">
              {calculateSaleToListRatio()}
            </p>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Days on Market</span>
            </div>
            <p className="text-lg font-bold text-teal-900">
              {calculateDaysOnMarket()}
            </p>
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Bedrooms</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {propertyData.bedrooms ? `${propertyData.bedrooms}` : 'N/A'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Square className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Square Feet</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatNumber(propertyData.squareFeet)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
