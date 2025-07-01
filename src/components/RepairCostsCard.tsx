
import React from 'react';
import { Wrench } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import MetricCard from './MetricCard';
import { formatCurrency } from '@/utils/formatters';
import { HomeInspectionAnalysis } from '@/types/inspection';

interface RepairCostsCardProps {
  totalRepairCost: number;
  analysis?: HomeInspectionAnalysis;
}

const RepairCostsCard: React.FC<RepairCostsCardProps> = ({ 
  totalRepairCost,
  analysis 
}) => {
  const bulletPoints = [
    'Labor and material estimates updated weekly for local markets',
    'Current market rates drawn from a database of millions of contractor bids',
    'Costs will vary by contractor but represent average prices in the property\'s area'
  ];

  // Calculate costs by priority
  const getCostBreakdown = () => {
    if (!analysis?.costSummary) return null;
    
    const highPriorityCost = (analysis.costSummary.immediatePriorityTotal?.max || 0) + 
                            (analysis.costSummary.highPriorityTotal?.max || 0);
    const mediumPriorityCost = analysis.costSummary.mediumPriorityTotal?.max || 0;
    const lowPriorityCost = analysis.costSummary.lowPriorityTotal?.max || 0;
    
    return {
      high: highPriorityCost,
      medium: mediumPriorityCost,
      low: lowPriorityCost
    };
  };

  const costBreakdown = getCostBreakdown();

  return (
    <MetricCard
      icon={Wrench}
      title="Total Repair Costs"
      bulletPoints={bulletPoints}
      bulletHeadline="Cost Factors Considered"
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-help">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalRepairCost)}
            </div>
            <div className="text-sm text-gray-600">
              Estimated maximum cost
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Cost Breakdown by Priority</h4>
            {costBreakdown ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-700">High Priority</span>
                  </div>
                  <span className="font-bold text-red-700">
                    {formatCurrency(costBreakdown.high)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-yellow-700">Medium Priority</span>
                  </div>
                  <span className="font-bold text-yellow-700">
                    {formatCurrency(costBreakdown.medium)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">Low Priority</span>
                  </div>
                  <span className="font-bold text-green-700">
                    {formatCurrency(costBreakdown.low)}
                  </span>
                </div>
                <div className="pt-2 border-t text-xs text-gray-600">
                  Total represents maximum estimated costs. Actual costs may vary based on contractor selection and specific repair approaches.
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Cost breakdown by priority is not available for this analysis.
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </MetricCard>
  );
};

export default RepairCostsCard;
