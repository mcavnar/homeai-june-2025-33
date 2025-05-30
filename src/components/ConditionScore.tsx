
import React from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';

interface ConditionScoreProps {
  analysis: HomeInspectionAnalysis;
  propertyData: RedfinPropertyData;
}

const ConditionScore: React.FC<ConditionScoreProps> = ({ analysis, propertyData }) => {
  const result = calculateConditionScore(analysis, propertyData);

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

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700">
          <TrendingUp className="h-5 w-5" />
          Property Condition Score
        </CardTitle>
        <CardDescription>
          Overall assessment based on repair costs, issue count, and market factors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          {/* Main Score Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
              {result.score}
            </div>
            <div className="text-sm text-gray-600">out of 10</div>
          </div>

          {/* Rating Badge */}
          <div className="text-center">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-2 font-semibold ${getRatingColor(result.rating)}`}
            >
              {result.rating}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">Condition Rating</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Raw Score (before normalization)</span>
            <span className="font-medium">{Math.round(result.rawScore)}/100</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-red-700 font-medium">Repair Penalty</div>
              <div className="text-red-900 text-lg font-semibold">
                -{Math.round(result.repairPenalty)}
              </div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-orange-700 font-medium">Issue Penalty</div>
              <div className="text-orange-900 text-lg font-semibold">
                -{Math.round(result.issuePenalty)}
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-700 font-medium">Market Penalty</div>
              <div className="text-purple-900 text-lg font-semibold">
                -{Math.round(result.marketPenalty)}
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mt-4">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>How it's calculated:</strong> The score considers repair costs relative to national averages, 
              total number of issues compared to typical homes, and how the property performs in the local market.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionScore;
