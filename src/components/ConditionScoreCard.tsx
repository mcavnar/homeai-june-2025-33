
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import MetricCard from './MetricCard';

interface ConditionScoreCardProps {
  score: number;
  rating: string;
}

const ConditionScoreCard: React.FC<ConditionScoreCardProps> = ({ 
  score, 
  rating 
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

  return (
    <MetricCard
      title="Overall Condition"
      showBullets={false}
      backgroundColor="bg-white"
      textColor="text-gray-900"
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-help">
            <div className={`text-4xl font-bold mb-1 ${getRatingColor(rating)}`}>
              {rating}
            </div>
            <div className="text-sm text-gray-500">
              {score} / 10
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Detailed Scoring Breakdown</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <strong>Repair Cost Analysis:</strong> Compares repair costs per square foot, percentage of property value, and cost per bedroom against national averages
              </div>
              <div>
                <strong>Issue Count Impact:</strong> Properties with 20+ issues receive penalties, with increasing severity for 30+ and 40+ issues
              </div>
              <div>
                <strong>Score Calculation:</strong> Starts at 100 points, subtracts penalties for repair severity and issue count, then converts to 0-10 scale
              </div>
              <div className="pt-2 border-t">
                <strong>Rating Scale:</strong>
                <div className="mt-1 text-xs space-y-1">
                  <div>9.2+ = Excellent</div>
                  <div>8.0+ = Very Good</div>
                  <div>6.5+ = Good</div>
                  <div>5.5+ = Fair</div>
                  <div>Below 5.5 = Poor</div>
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </MetricCard>
  );
};

export default ConditionScoreCard;
