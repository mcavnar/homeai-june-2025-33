
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
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
  // Calculate costs by priority from actual cost summary
  const getCostBreakdown = () => {
    if (!analysis?.costSummary) return null;
    
    const highPriorityCost = analysis.costSummary.highPriorityTotal?.max || 0;
    const mediumPriorityCost = analysis.costSummary.mediumPriorityTotal?.max || 0;
    const lowPriorityCost = analysis.costSummary.lowPriorityTotal?.max || 0;
    
    return {
      high: highPriorityCost,
      medium: mediumPriorityCost,
      low: lowPriorityCost
    };
  };

  const costBreakdown = getCostBreakdown();

  // Generate smart bullet points based on actual cost data
  const getBulletPoints = () => {
    if (!costBreakdown) return [];
    
    const bullets = [];
    
    // High priority cost insight (only if there are actual high priority costs)
    if (costBreakdown.high > 0) {
      const highPercent = ((costBreakdown.high / totalRepairCost) * 100).toFixed(0);
      bullets.push(`${highPercent}% are high-priority repairs (${formatCurrency(costBreakdown.high)})`);
    } else {
      bullets.push(`No high-priority repairs needed - good news for your budget`);
    }
    
    // Cost distribution insight
    const nonZeroCosts = Object.values(costBreakdown).filter(cost => cost > 0).length;
    if (nonZeroCosts === 1) {
      bullets.push(`All costs concentrated in single priority category`);
    } else {
      bullets.push(`Costs spread across ${nonZeroCosts} priority categories`);
    }
    
    // Optional/low priority items insight
    if (costBreakdown.low > 0) {
      const lowPercent = ((costBreakdown.low / totalRepairCost) * 100).toFixed(0);
      bullets.push(`${lowPercent}% are optional improvements (${formatCurrency(costBreakdown.low)})`);
    } else if (costBreakdown.medium > 0) {
      const mediumPercent = ((costBreakdown.medium / totalRepairCost) * 100).toFixed(0);
      bullets.push(`${mediumPercent}% are medium-priority items (${formatCurrency(costBreakdown.medium)})`);
    } else {
      bullets.push(`Minimal optional improvements needed`);
    }
    
    return bullets.slice(0, 3); // Ensure exactly 3 bullets
  };

  const bulletPoints = getBulletPoints();

  return (
    <MetricCard
      title="Estimated Repair Costs"
      bulletPoints={bulletPoints}
      bulletHeadline="Key cost insights:"
      showBullets={bulletPoints.length > 0}
      backgroundColor="bg-white"
      textColor="text-gray-900"
    >
      <div className="flex items-start justify-between w-full">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-help flex-1">
              <div className="text-4xl font-bold mb-1 text-blue-600">
                {formatCurrency(totalRepairCost)}
              </div>
              <div className="text-sm text-gray-500">
                (Top of range estimate)
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
        <Info className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
      </div>
    </MetricCard>
  );
};

export default RepairCostsCard;
