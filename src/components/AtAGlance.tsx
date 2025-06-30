
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

  // Prepare data for custom mini bars
  const chartData = [
    {
      priority: 'High',
      count: issueCounts.immediate + issueCounts.high,
      color: '#ef4444'
    },
    {
      priority: 'Medium',
      count: issueCounts.medium,
      color: '#eab308'
    },
    {
      priority: 'Low',
      count: issueCounts.low,
      color: '#3b82f6'
    }
  ].filter(item => item.count > 0);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

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
    <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
      {/* Condition Score Card */}
      <Card className="border-indigo-200">
        <CardContent className="p-0">
          {/* Header Section - Fixed Height */}
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Condition Score</h3>
            </div>
          </div>
          
          {/* Main Metric Section - Reduced Padding */}
          <div className="px-4 sm:px-6 pb-2 h-48 flex flex-col justify-center items-center">
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
          
          {/* Visual Separator */}
          <div className="border-t border-gray-100 mx-4 sm:mx-6"></div>
          
          {/* Context Bullets Section - Responsive and Overflow Protected */}
          <div className="p-3 sm:p-6 pt-6 min-h-24 flex items-start overflow-hidden">
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 w-full break-words leading-tight">
              <li>• Repair costs vs. property value</li>
              <li>• Compares to similar area properties</li>
              <li>• Age and maintenance history</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Total Repair Costs Card */}
      <Card className="border-indigo-200">
        <CardContent className="p-0">
          {/* Header Section - Fixed Height */}
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Total Repair Costs</h3>
            </div>
          </div>
          
          {/* Main Metric Section - Reduced Padding */}
          <div className="px-4 sm:px-6 pb-2 h-48 flex flex-col justify-center items-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalRepairCost)}
            </div>
            <div className="text-sm text-gray-600">
              Estimated maximum cost
            </div>
          </div>
          
          {/* Visual Separator */}
          <div className="border-t border-gray-100 mx-4 sm:mx-6"></div>
          
          {/* Context Bullets Section - Responsive and Overflow Protected */}
          <div className="p-3 sm:p-6 pt-6 min-h-24 flex items-start overflow-hidden">
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 w-full break-words leading-tight">
              <li>• Labor and material estimates</li>
              <li>• Current market rates</li>
              <li>• Worst-case scenario costs</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Issues Found Card */}
      <Card className="border-indigo-200">
        <CardContent className="p-0">
          {/* Header Section - Fixed Height */}
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Issues Found</h3>
            </div>
          </div>
          
          {/* Main Metric Section - Custom Mini Bar Chart with Reduced Padding */}
          <div className="px-4 sm:px-6 pb-2 h-48 flex flex-col justify-center items-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {totalIssues}
            </div>
            <div className="text-sm text-gray-600 mb-3">Total issues</div>
            
            {/* Custom Mini Bar Chart - Guaranteed to Fit */}
            {chartData.length > 0 && (
              <div className="flex gap-2 items-end justify-center w-full h-6">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div 
                      className="rounded-t-sm min-h-[4px] transition-all hover:opacity-80" 
                      style={{ 
                        backgroundColor: item.color, 
                        width: '16px',
                        height: `${Math.max(4, (item.count / maxCount) * 16)}px`
                      }}
                      title={`${item.priority}: ${item.count}`}
                    />
                    <span className="text-[7px] text-gray-500 font-medium">{item.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Visual Separator */}
          <div className="border-t border-gray-100 mx-4 sm:mx-6"></div>
          
          {/* Context Bullets Section - Responsive and Overflow Protected */}
          <div className="p-3 sm:p-6 pt-6 min-h-24 flex items-start overflow-hidden">
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 w-full break-words leading-tight">
              <li>• High: Safety & structural issues</li>
              <li>• Medium: Systems needing attention</li>
              <li>• Low: Cosmetic & maintenance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtAGlance;
