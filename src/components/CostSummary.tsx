
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface CostSummaryProps {
  costSummary: {
    highPriorityTotal: { min: number; max: number; };
    mediumPriorityTotal: { min: number; max: number; };
    grandTotal: { min: number; max: number; };
  };
}

const CostSummary: React.FC<CostSummaryProps> = ({ costSummary }) => {
  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <DollarSign className="h-5 w-5" />
          Estimated Repair Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(costSummary.highPriorityTotal.min)} - {formatCurrency(costSummary.highPriorityTotal.max)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(costSummary.mediumPriorityTotal.min)} - {formatCurrency(costSummary.mediumPriorityTotal.max)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Total Estimate</h4>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(costSummary.grandTotal.min)} - {formatCurrency(costSummary.grandTotal.max)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
