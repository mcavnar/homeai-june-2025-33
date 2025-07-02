
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Very Good':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradientColors = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return { from: 'green-500', to: 'green-600', icon: 'text-green-100' };
      case 'Very Good':
        return { from: 'emerald-500', to: 'emerald-600', icon: 'text-emerald-100' };
      case 'Good':
        return { from: 'blue-500', to: 'blue-600', icon: 'text-blue-100' };
      case 'Fair':
        return { from: 'yellow-500', to: 'yellow-600', icon: 'text-yellow-100' };
      case 'Poor':
        return { from: 'red-500', to: 'red-600', icon: 'text-red-100' };
      default:
        return { from: 'gray-500', to: 'gray-600', icon: 'text-gray-100' };
    }
  };

  const gradientColors = getGradientColors(rating);

  return (
    <MetricCard
      icon={TrendingUp}
      title="Condition Score"
      showBullets={false}
      gradientFrom={gradientColors.from}
      gradientTo={gradientColors.to}
      iconColor={gradientColors.icon}
      textColor="text-white"
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-help">
            <div className={`text-3xl font-bold mb-1`}>
              {score}
            </div>
            <div className={`text-sm ${gradientColors.icon} mb-2`}>out of 10</div>
            <Badge 
              variant="outline" 
              className={`text-xs px-2 py-1 font-medium ${getRatingColor(rating)}`}
            >
              {rating}
            </Badge>
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
