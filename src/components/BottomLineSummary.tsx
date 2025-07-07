
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { generateConditionSummary, generateCostContext, generateActionPriority } from '@/utils/summaryHelpers';

interface BottomLineSummaryProps {
  analysis: HomeInspectionAnalysis;
  propertyData: RedfinPropertyData;
}

const BottomLineSummary: React.FC<BottomLineSummaryProps> = ({ analysis, propertyData }) => {
  // Generate dynamic content for each bullet point
  const conditionSummary = generateConditionSummary(analysis, propertyData);
  const costContext = generateCostContext(analysis, propertyData);
  const actionPriority = generateActionPriority(analysis);

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bottom Line:</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 font-bold mr-2">•</span>
            <span>{conditionSummary}</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-bold mr-2">•</span>
            <span>{costContext}</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 font-bold mr-2">•</span>
            <span>{actionPriority}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default BottomLineSummary;
