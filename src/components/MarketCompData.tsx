
import React from 'react';
import { TrendingUp, Percent, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPercentage } from '@/utils/formatters';

interface MarketCompDataProps {
  neighborhoodAvgDaysOnMarket: number | null;
  neighborhoodAvgSaleToListRatio: number | null;
  nearbyHomesAvgSquareFeet: number | null;
}

const MarketCompData: React.FC<MarketCompDataProps> = ({
  neighborhoodAvgDaysOnMarket,
  neighborhoodAvgSaleToListRatio,
  nearbyHomesAvgSquareFeet,
}) => {
  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <TrendingUp className="h-5 w-5" />
          Market Comp Data
        </CardTitle>
        <CardDescription>Neighborhood market insights and nearby home comparisons</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Neighborhood Average Days on Market */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">
                Neighborhood Avg Days on Market
              </span>
            </div>
            <p className="text-xl font-bold text-orange-900">
              {neighborhoodAvgDaysOnMarket ? `${Math.round(neighborhoodAvgDaysOnMarket)} days` : 'N/A'}
            </p>
          </div>

          {/* Neighborhood Average Sale-to-List Ratio */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                Neighborhood Avg Sale-to-List
              </span>
            </div>
            <p className="text-xl font-bold text-yellow-900">
              {formatPercentage(neighborhoodAvgSaleToListRatio)}
            </p>
          </div>

          {/* Nearby Homes Average Square Feet */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                Nearby Homes Avg Sq Ft
              </span>
            </div>
            <p className="text-xl font-bold text-amber-900">
              {formatNumber(nearbyHomesAvgSquareFeet)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCompData;
