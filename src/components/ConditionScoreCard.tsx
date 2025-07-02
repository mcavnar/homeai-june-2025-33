
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
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-100';
    if (score >= 6.5) return 'text-blue-100';
    if (score >= 5.5) return 'text-yellow-100';
    return 'text-red-100';
  };

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

  return (
    <MetricCard
      icon={TrendingUp}
      title="Condition Score"
      showBullets={false}
      gradientFrom="blue-500"
      gradientTo="blue-600"
      iconColor="text-blue-100"
      textColor="text-white"
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-help">
            <div className={`text-3xl font-bold mb-1`}>
              {score}
            </div>
            <div className="text-sm text-blue-100 mb-2">out of 10</div>
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
