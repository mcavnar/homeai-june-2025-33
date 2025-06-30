
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    if (score >= 8.0) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
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

  const bulletPoints = [
    'Repair costs analyzed against property value and national benchmarks',
    'Issue count compared to typical home inspection findings (20+ issues trigger penalties)',
    'Property size and features measured against neighborhood averages'
  ];

  return (
    <MetricCard
      icon={TrendingUp}
      title="Condition Score"
      bulletPoints={bulletPoints}
      bulletHeadline="Scoring Methodology"
    >
      <div className={`text-5xl font-bold ${getScoreColor(score)} mb-2`}>
        {score}
      </div>
      <div className="text-sm text-gray-600 mb-3">out of 10</div>
      <Badge 
        variant="outline" 
        className={`text-sm px-3 py-1 font-medium ${getRatingColor(rating)}`}
      >
        {rating}
      </Badge>
    </MetricCard>
  );
};

export default ConditionScoreCard;
