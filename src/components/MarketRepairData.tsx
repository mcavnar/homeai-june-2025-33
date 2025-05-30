
import React from 'react';
import { Calculator, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { RedfinPropertyData } from '@/types/redfin';

interface MarketRepairDataProps {
  propertyData: RedfinPropertyData;
}

const MarketRepairData: React.FC<MarketRepairDataProps> = ({ propertyData }) => {
  // Calculate Market Average Repair Costs = 7,600 + 1% × Home Value
  const calculateMarketAverage = (): number | null => {
    const homeValue = propertyData.soldPrice || propertyData.listedPrice;
    if (!homeValue) return null;
    
    return 7600 + (homeValue * 0.01);
  };

  const marketAverageRepairCosts = calculateMarketAverage();

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Calculator className="h-5 w-5" />
          Market Comparison
        </CardTitle>
        <CardDescription>
          How your repair costs compare to market averages for similar homes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Market Average Repair Costs */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Market Average Repair Costs for a home like yours
              </span>
            </div>
            <p className="text-xl font-bold text-purple-900">
              {marketAverageRepairCosts ? formatCurrency(marketAverageRepairCosts) : 'N/A'}
            </p>
            {!marketAverageRepairCosts && (
              <p className="text-xs text-purple-600 mt-1">
                Property value not available for calculation
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketRepairData;
