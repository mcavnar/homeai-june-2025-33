
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import MetricCard from './MetricCard';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';
import { formatCurrency } from '@/utils/formatters';

interface ConditionScoreCardProps {
  score: number;
  rating: string;
  analysis: HomeInspectionAnalysis;
  propertyData: RedfinPropertyData;
}

const ConditionScoreCard: React.FC<ConditionScoreCardProps> = ({ 
  score, 
  rating,
  analysis,
  propertyData
}) => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return 'text-green-600';
      case 'Very Good':
        return 'text-emerald-600';
      case 'Good':
        return 'text-green-600';
      case 'Fair':
        return 'text-yellow-600';
      case 'Poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get detailed scoring breakdown
  const conditionResult = calculateConditionScore(analysis, propertyData);
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;
  
  // Calculate repair cost per sq ft
  const repairCostPerSqft = propertyData.squareFeet ? totalRepairCost / propertyData.squareFeet : 0;
  
  // Calculate repair cost as percentage of home value
  const repairCostPercentage = propertyData.soldPrice ? (totalRepairCost / propertyData.soldPrice) * 100 : 0;

  // Determine performance vs benchmarks
  const getPerformanceText = () => {
    if (score >= 8.0) return "Better than 75% of comparable homes";
    if (score >= 6.5) return "Better than 60% of comparable homes";
    if (score >= 5.5) return "Better than 40% of comparable homes";
    return "Below average compared to similar homes";
  };

  // Generate smart bullet points - always 3 bullets
  const getBulletPoints = () => {
    const bullets = [];
    
    // Always include comparison to database
    bullets.push("Compared against 239,900+ national property records");
    
    // Performance comparison
    if (score >= 8.0) {
      bullets.push("Better condition than 75% of comparable homes");
    } else if (score >= 6.5) {
      bullets.push("Better condition than 60% of comparable homes");
    } else if (score >= 5.5) {
      bullets.push("Better condition than 40% of comparable homes");
    } else {
      bullets.push("Below average compared to similar homes");
    }
    
    // Cost context or issue context (choose most relevant)
    const nationalAvgCostPerSqft = 4.19;
    const totalIssues = analysis.issues?.length || 0;
    const nationalAvgIssues = 20.67;
    
    if (repairCostPerSqft < nationalAvgCostPerSqft * 0.8) {
      bullets.push(`Low repair costs: $${repairCostPerSqft.toFixed(2)}/sqft vs $${nationalAvgCostPerSqft}/sqft avg`);
    } else if (repairCostPerSqft > nationalAvgCostPerSqft * 1.2) {
      bullets.push(`Higher repair costs: $${repairCostPerSqft.toFixed(2)}/sqft vs $${nationalAvgCostPerSqft}/sqft avg`);
    } else if (totalIssues < nationalAvgIssues * 0.8) {
      bullets.push(`Fewer issues than typical (${totalIssues} vs ${nationalAvgIssues.toFixed(0)} avg)`);
    } else if (totalIssues > nationalAvgIssues * 1.2) {
      bullets.push(`More issues than typical (${totalIssues} vs ${nationalAvgIssues.toFixed(0)} avg)`);
    } else {
      bullets.push(`Standard issue count (${totalIssues} vs ${nationalAvgIssues.toFixed(0)} avg)`);
    }
    
    return bullets; // Always exactly 3 bullets
  };

  const bulletPoints = getBulletPoints();

  return (
    <MetricCard
      title="Overall Condition"
      bulletPoints={bulletPoints}
      bulletHeadline="Market analysis insights:"
      showBullets={bulletPoints.length > 0}
      backgroundColor="bg-white"
      textColor="text-gray-900"
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-start justify-between w-full cursor-help">
            <div className="flex-1">
              <div className={`text-4xl font-bold mb-1 ${getRatingColor(rating)}`}>
                {rating}
              </div>
              <div className="text-sm text-gray-500">
                {score} / 10
              </div>
            </div>
            <Info className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Advanced Market Analysis:</h4>
              <p className="text-sm text-gray-700">
                This score analyzes your home against <strong>239,900+ national property records</strong>, 
                comparing repair costs per sq ft (${repairCostPerSqft.toFixed(2)} vs $4.19 avg), 
                percentage of home value ({repairCostPercentage.toFixed(2)}% vs 4.17% avg), 
                and 20+ issue categories from thousands of inspection reports.
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>• Repair severity:</span>
                <span className="font-medium">-{conditionResult.repairPenalty.toFixed(1)} pts vs national baselines</span>
              </div>
              <div className="flex justify-between">
                <span>• Issue frequency:</span>
                <span className="font-medium">-{conditionResult.issuePenalty.toFixed(1)} pts vs 20.67 avg issues</span>
              </div>
              <div className="flex justify-between">
                <span>• Market performance:</span>
                <span className="font-medium">-{conditionResult.marketPenalty.toFixed(1)} pts vs local comps</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="text-sm font-medium text-green-700">
                Result: {getPerformanceText()}
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </MetricCard>
  );
};

export default ConditionScoreCard;
