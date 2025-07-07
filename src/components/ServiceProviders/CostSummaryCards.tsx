
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
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-600">Estimated Monthly Average</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(costSummary.monthlyAverage)}</p>
            <p className="text-sm text-gray-600">Based on scheduled services only</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Calculator className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-600">Estimated Annual Total</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(costSummary.annualTotal)}</p>
            <p className="text-sm text-gray-600">Excludes as-needed services</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-600">Difference vs Market Average</h3>
            <p className="text-3xl font-bold text-gray-900">+{formatCurrency(costSummary.marketDifference)}</p>
            <p className="text-sm text-gray-600">Based on service providers in your area</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostSummaryCards;
