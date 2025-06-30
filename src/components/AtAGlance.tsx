
import React from 'react';
import { TrendingUp, AlertTriangle, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { calculateConditionScore } from '@/utils/conditionScore';
import { formatCurrency } from '@/utils/formatters';

interface AtAGlanceProps {
  analysis: HomeInspectionAnalysis;
  propertyData: RedfinPropertyData;
}

const AtAGlance: React.FC<AtAGlanceProps> = ({ analysis, propertyData }) => {
  const conditionResult = calculateConditionScore(analysis, propertyData);
  const totalRepairCost = analysis.costSummary?.grandTotal?.max || 0;
  const totalIssues = analysis.issues?.length || 0;

  // Count issues by priority
  const issueCounts = {
    immediate: analysis.issues?.filter(issue => issue.priority === 'immediate').length || 0,
    high: analysis.issues?.filter(issue => issue.priority === 'high').length || 0,
    medium: analysis.issues?.filter(issue => issue.priority === 'medium').length || 0,
    low: analysis.issues?.filter(issue => issue.priority === 'low').length || 0,
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

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-indigo-200">
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Condition Score */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Condition Score</h3>
            </div>
            <div className={`text-5xl font-bold ${getScoreColor(conditionResult.score)} mb-2`}>
              {conditionResult.score}
            </div>
            <div className="text-sm text-gray-600 mb-3">out of 10</div>
            <Badge 
              variant="outline" 
              className={`text-sm px-3 py-1 font-medium ${getRatingColor(conditionResult.rating)}`}
            >
              {conditionResult.rating}
            </Badge>
          </div>

          {/* Center: Total Repair Costs */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wrench className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Total Repair Costs</h3>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalRepairCost)}
            </div>
            <div className="text-sm text-gray-600">
              Estimated maximum cost
            </div>
          </div>

          {/* Right: Issues Breakdown */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Issues Found</h3>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {totalIssues}
            </div>
            <div className="text-sm text-gray-600 mb-4">Total issues</div>
            
            {/* Priority Bars */}
            <div className="space-y-2">
              {(issueCounts.immediate > 0 || issueCounts.high > 0) && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-700 font-medium">
                    {issueCounts.immediate > 0 ? 'Immediate' : 'High'} Priority
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ 
                          width: `${Math.max(10, ((issueCounts.immediate + issueCounts.high) / totalIssues) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-gray-700 font-medium w-6 text-right">
                      {issueCounts.immediate + issueCounts.high}
                    </span>
                  </div>
                </div>
              )}
              
              {issueCounts.medium > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-700 font-medium">Medium Priority</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ 
                          width: `${Math.max(10, (issueCounts.medium / totalIssues) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-gray-700 font-medium w-6 text-right">
                      {issueCounts.medium}
                    </span>
                  </div>
                </div>
              )}
              
              {issueCounts.low > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-orange-700 font-medium">Low Priority</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ 
                          width: `${Math.max(10, (issueCounts.low / totalIssues) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-gray-700 font-medium w-6 text-right">
                      {issueCounts.low}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AtAGlance;
