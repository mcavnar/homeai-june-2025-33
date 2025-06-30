
import React from 'react';
import { DollarSign, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';

interface CostSummaryProps {
  costSummary: {
    immediatePriorityTotal?: { min: number; max: number; };
    highPriorityTotal: { min: number; max: number; };
    mediumPriorityTotal: { min: number; max: number; };
    lowPriorityTotal?: { min: number; max: number; };
    grandTotal: { min: number; max: number; };
  };
  issues?: Array<{
    priority: 'immediate' | 'high' | 'medium' | 'low';
    description: string;
    estimatedCost: { min: number; max: number; };
  }>;
}

const CostSummary: React.FC<CostSummaryProps> = ({ costSummary, issues = [] }) => {
  // Combine immediate and high priority costs
  const combinedHighPriorityMax = (costSummary.immediatePriorityTotal?.max || 0) + costSummary.highPriorityTotal.max;
  const mediumPriorityMax = costSummary.mediumPriorityTotal.max;
  const lowPriorityMax = costSummary.lowPriorityTotal?.max || 0;
  
  // Calculate total from displayed values instead of using backend grandTotal
  const calculatedTotalMax = combinedHighPriorityMax + mediumPriorityMax + lowPriorityMax;
  
  // Count issues by priority
  const highPriorityCount = issues.filter(issue => 
    issue.priority === 'immediate' || issue.priority === 'high'
  ).length;
  const mediumPriorityCount = issues.filter(issue => issue.priority === 'medium').length;
  const lowPriorityCount = issues.filter(issue => issue.priority === 'low').length;
  
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
          Number of Issues and Their Estimated Repair Costs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority Level</TableHead>
                <TableHead className="text-center">Number of Issues</TableHead>
                <TableHead className="text-right">Estimated Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-red-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-700">High Priority</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold text-red-700">
                  {highPriorityCount}
                </TableCell>
                <TableCell className="text-right font-bold text-red-700">
                  {formatCurrency(combinedHighPriorityMax)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-yellow-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-yellow-700">Medium Priority</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold text-yellow-700">
                  {mediumPriorityCount}
                </TableCell>
                <TableCell className="text-right font-bold text-yellow-700">
                  {formatCurrency(mediumPriorityMax)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-green-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">Low Priority</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold text-green-700">
                  {lowPriorityCount}
                </TableCell>
                <TableCell className="text-right font-bold text-green-700">
                  {formatCurrency(lowPriorityMax)}
                </TableCell>
              </TableRow>
              <TableRow className="border-t-2 border-gray-200">
                <TableCell>
                  <span className="font-bold text-gray-900">Total Estimate</span>
                </TableCell>
                <TableCell className="text-center font-bold text-gray-900">
                  {highPriorityCount + mediumPriorityCount + lowPriorityCount}
                </TableCell>
                <TableCell className="text-right font-bold text-gray-900 text-lg">
                  {formatCurrency(calculatedTotalMax)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Priority Definitions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-gray-600" />
            <h5 className="font-semibold text-gray-700">Priority Definitions</h5>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-red-700">High Priority:</span>
                <span className="text-gray-700 ml-1">Safety issues, structural problems, or systems that could cause damage if not addressed immediately</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-yellow-700">Medium Priority:</span>
                <span className="text-gray-700 ml-1">Issues that should be addressed within 1-2 years to prevent deterioration or higher costs</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-green-700">Low Priority:</span>
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
