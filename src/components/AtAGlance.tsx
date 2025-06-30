
import React from 'react';
import { TrendingUp, AlertTriangle, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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

  // Prepare data for bar chart
  const chartData = [
    {
      priority: 'High',
      count: issueCounts.immediate + issueCounts.high,
      fill: '#ef4444'
    },
    {
      priority: 'Medium',
      count: issueCounts.medium,
      fill: '#eab308'
    },
    {
      priority: 'Low',
      count: issueCounts.low,
      fill: '#3b82f6'
    }
  ].filter(item => item.count > 0);

  const chartConfig = {
    count: {
      label: "Issues",
    },
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
    <div className="grid md:grid-cols-3 gap-6">
      {/* Condition Score Card */}
      <Card className="border-indigo-200">
        <CardContent className="p-0">
          {/* Header Section - Fixed Height */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Condition Score</h3>
            </div>
          </div>
          
          {/* Main Metric Section - Fixed Height for Alignment */}
          <div className="px-6 pb-4 h-32 flex flex-col justify-center items-center">
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
          <div className="border-t border-gray-100 mx-6"></div>
          
          {/* Context Bullets Section - Fixed Height */}
          <div className="p-6 pt-4 h-24 flex items-start">
            <ul className="text-xs text-gray-600 space-y-1 w-full">
              <li>• Factors in repair costs vs. property value</li>
              <li>• Compares to similar properties in area</li>
              <li>• Considers age and maintenance history</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Total Repair Costs Card */}
      <Card className="border-indigo-200">
        <CardContent className="p-0">
          {/* Header Section - Fixed Height */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Total Repair Costs</h3>
            </div>
          </div>
          
          {/* Main Metric Section - Fixed Height for Alignment */}
          <div className="px-6 pb-4 h-32 flex flex-col justify-center items-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalRepairCost)}
            </div>
            <div className="text-sm text-gray-600">
              Estimated maximum cost
            </div>
          </div>
          
          {/* Visual Separator */}
          <div className="border-t border-gray-100 mx-6"></div>
          
          {/* Context Bullets Section - Fixed Height */}
          <div className="p-6 pt-4 h-24 flex items-start">
            <ul className="text-xs text-gray-600 space-y-1 w-full">
              <li>• Includes labor and material estimates</li>
              <li>• Based on current market rates</li>
              <li>• Represents worst-case scenario costs</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Issues Found Card */}
      <Card className="border-indigo-200">
        <CardContent className="p-0">
          {/* Header Section - Fixed Height */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Issues Found</h3>
            </div>
          </div>
          
          {/* Main Metric Section - Fixed Height for Alignment */}
          <div className="px-6 pb-4 h-32 flex flex-col justify-center items-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {totalIssues}
            </div>
            <div className="text-sm text-gray-600 mb-3">Total issues</div>
            
            {/* Bar Chart - Consistent Height */}
            {chartData.length > 0 && (
              <div className="h-16 w-full">
                <ChartContainer config={chartConfig}>
                  <BarChart data={chartData} margin={{ top: 0, right: 5, left: 5, bottom: 10 }}>
                    <XAxis 
                      dataKey="priority" 
                      tick={{ fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[2, 2, 0, 0]}
                      stroke="none"
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </div>
          
          {/* Visual Separator */}
          <div className="border-t border-gray-100 mx-6"></div>
          
          {/* Context Bullets Section - Fixed Height */}
          <div className="p-6 pt-4 h-24 flex items-start">
            <ul className="text-xs text-gray-600 space-y-1 w-full">
              <li>• High: Safety hazards & structural concerns</li>
              <li>• Medium: Systems needing attention soon</li>
              <li>• Low: Cosmetic & preventive maintenance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtAGlance;
