
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';
import { formatCurrency } from '@/utils/formatters';

interface BottomLineSummaryProps {
  analysis: HomeInspectionAnalysis;
  propertyData: RedfinPropertyData;
}

const BottomLineSummary: React.FC<BottomLineSummaryProps> = ({ analysis, propertyData }) => {
  const conditionResult = calculateConditionScore(analysis, propertyData);
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;
  const totalIssues = analysis.issues?.length || 0;
  
  // Count high priority issues (immediate + high)
  const highPriorityCount = analysis.issues?.filter(issue => 
    issue.priority === 'immediate' || issue.priority === 'high'
  ).length || 0;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bottom Line:</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 font-bold mr-2">•</span>
            <span>
              This home is in {conditionResult.rating.toLowerCase()} condition with {totalIssues} items identified, 
              most of which are standard for homes in this price range.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-bold mr-2">•</span>
            <span>
              While repair costs of {formatCurrency(totalRepairCost)} are above average, 
              this provides clear negotiation leverage and improvement opportunities.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-bold mr-2">•</span>
            <span>
              {highPriorityCount > 0 
                ? `${highPriorityCount} safety items should be addressed promptly, but having this knowledge puts you in control.`
                : 'No immediate safety concerns identified, giving you flexibility in timing repairs.'
              }
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default BottomLineSummary;
