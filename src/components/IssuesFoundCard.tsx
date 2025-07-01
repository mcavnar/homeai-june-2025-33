
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
      bulletHeadline="Issue Priority Definition"
    >
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {totalIssues}
      </div>
      <div className="text-sm text-gray-600 mb-6">Total issues</div>
      
      {/* Compact Bar Chart with Numbers on Bars */}
      {chartData.length > 0 && (
        <div className="flex gap-2 items-end justify-center w-full h-8">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-1 group cursor-default"
              title={`${item.priority} Priority: ${item.count} issue${item.count > 1 ? 's' : ''}`}
            >
              <div 
                className="rounded-t-sm min-h-[8px] transition-all duration-200 hover:opacity-80 group-hover:shadow-sm relative flex items-center justify-center" 
                style={{ 
                  backgroundColor: item.color, 
                  width: '32px',
                  height: `${Math.max(8, (item.count / maxCount) * 24)}px`
                }}
              >
                <span className="text-xs font-bold text-white drop-shadow-sm">
                  {item.count}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </MetricCard>
  );
};

export default IssuesFoundCard;
