
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Calculator, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface CostSummaryCardsProps {
  costSummary: {
    monthlyAverage: number;
    annualTotal: number;
    marketDifference: number;
  };
}

const CostSummaryCards: React.FC<CostSummaryCardsProps> = ({ costSummary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-blue-100" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-100">Estimated Monthly Average</h3>
            <p className="text-3xl font-bold">{formatCurrency(costSummary.monthlyAverage)}</p>
            <p className="text-sm text-blue-100">Based on scheduled services only</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Calculator className="h-8 w-8 text-purple-100" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-100">Estimated Annual Total</h3>
            <p className="text-3xl font-bold">{formatCurrency(costSummary.annualTotal)}</p>
            <p className="text-sm text-purple-100">Excludes as-needed services</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-red-100" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-100">Difference vs Market Average</h3>
            <p className="text-3xl font-bold">+{formatCurrency(costSummary.marketDifference)}</p>
            <p className="text-sm text-red-100">Based on service providers in your area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostSummaryCards;
