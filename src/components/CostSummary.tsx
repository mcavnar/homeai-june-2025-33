
import React from 'react';
import { DollarSign, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface CostSummaryProps {
  costSummary: {
    immediatePriorityTotal?: { min: number; max: number; };
    highPriorityTotal: { min: number; max: number; };
    mediumPriorityTotal: { min: number; max: number; };
    lowPriorityTotal?: { min: number; max: number; };
    grandTotal: { min: number; max: number; };
  };
}

const CostSummary: React.FC<CostSummaryProps> = ({ costSummary }) => {
  // Combine immediate and high priority costs
  const combinedHighPriorityMax = (costSummary.immediatePriorityTotal?.max || 0) + costSummary.highPriorityTotal.max;
  const mediumPriorityMax = costSummary.mediumPriorityTotal.max;
  const lowPriorityMax = costSummary.lowPriorityTotal?.max || 0;
  
  // Calculate total from displayed values instead of using backend grandTotal
  const calculatedTotalMax = combinedHighPriorityMax + mediumPriorityMax + lowPriorityMax;
  
  // Debug logging to identify discrepancies
  const backendGrandTotalMax = costSummary.grandTotal.max;
  if (Math.abs(calculatedTotalMax - backendGrandTotalMax) > 10) {
    console.warn('Cost total discrepancy detected:', {
      calculatedTotal: calculatedTotalMax,
      backendGrandTotal: backendGrandTotalMax,
      difference: calculatedTotalMax - backendGrandTotalMax,
      breakdown: {
        highPriority: combinedHighPriorityMax,
        mediumPriority: mediumPriorityMax,
        lowPriority: lowPriorityMax
      }
    });
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <DollarSign className="h-5 w-5" />
          Estimated Repair Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(combinedHighPriorityMax)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(mediumPriorityMax)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Low Priority</h4>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(lowPriorityMax)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Total Estimate</h4>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(calculatedTotalMax)}
            </p>
          </div>
        </div>

        {/* Priority Definitions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-gray-600" />
            <h5 className="font-semibold text-gray-700">Priority Definitions</h5>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-red-800">High Priority:</span>
                <span className="text-gray-700 ml-1">Safety issues, structural problems, or systems that could cause damage if not addressed immediately</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-yellow-800">Medium Priority:</span>
                <span className="text-gray-700 ml-1">Issues that should be addressed within 1-2 years to prevent deterioration or higher costs</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-orange-800">Low Priority:</span>
                <span className="text-gray-700 ml-1">Cosmetic or minor maintenance items that can be addressed over time for comfort and aesthetics</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
