
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  return (
    <MetricCard
      icon={AlertTriangle}
      title="Issues Found"
      showBullets={false}
      gradientClass="bg-gradient-to-br from-orange-500 to-orange-600"
      iconColor="text-orange-100"
      textColor="text-white"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help w-full">
              <div className="text-3xl font-bold mb-3">
                {totalIssues}
              </div>
              
              {/* Left-aligned Bar Chart with Numbers on Bars */}
              {chartData.length > 0 && (
                <div className="flex gap-3 items-end justify-start w-full h-10 px-1">
                  {chartData.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-1 group cursor-default min-w-[36px]"
                    >
                      <div 
                        className="rounded-t-sm min-h-[10px] transition-all duration-200 hover:opacity-80 group-hover:shadow-sm relative flex items-center justify-center" 
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.8)', 
                          width: '32px',
                          height: `${Math.max(10, (item.count / maxCount) * 28)}px`
                        }}
                      >
                        <span className="text-xs font-bold text-orange-600 drop-shadow-sm">
                          {item.count}
                        </span>
                      </div>
                      <span className="text-xs text-orange-100 font-medium group-hover:text-white transition-colors">
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Issue Priority Definition</h4>
              <div className="text-xs space-y-1">
                <div><strong>High:</strong> Safety & structural issues</div>
                <div><strong>Medium:</strong> Systems needing attention</div>
                <div><strong>Low:</strong> Cosmetic & maintenance</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </MetricCard>
  );
};

export default IssuesFoundCard;
