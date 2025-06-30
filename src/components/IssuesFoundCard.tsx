
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import MetricCard from './MetricCard';
import { InspectionIssue } from '@/types/inspection';

interface IssuesFoundCardProps {
  issues: InspectionIssue[];
}

const IssuesFoundCard: React.FC<IssuesFoundCardProps> = ({ issues }) => {
  const totalIssues = issues?.length || 0;

  // Count issues by priority
  const issueCounts = {
    immediate: issues?.filter(issue => issue.priority === 'immediate').length || 0,
    high: issues?.filter(issue => issue.priority === 'high').length || 0,
    medium: issues?.filter(issue => issue.priority === 'medium').length || 0,
    low: issues?.filter(issue => issue.priority === 'low').length || 0,
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

  const bulletPoints = [
    'High: Safety & structural issues',
    'Medium: Systems needing attention',
    'Low: Cosmetic & maintenance'
  ];

  return (
    <MetricCard
      icon={AlertTriangle}
      title="Issues Found"
      bulletPoints={bulletPoints}
    >
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
    </MetricCard>
  );
};

export default IssuesFoundCard;
