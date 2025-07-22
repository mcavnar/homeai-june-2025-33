
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import MetricCard from './MetricCard';
import { InspectionIssue } from '@/types/inspection';

interface IssuesFoundCardProps {
  issues: InspectionIssue[];
}

const IssuesFoundCard: React.FC<IssuesFoundCardProps> = ({ issues }) => {
  const totalIssues = issues.length;
  
  // Count issues by priority
  const highPriorityCount = issues.filter(issue => 
    issue.priority === 'immediate' || issue.priority === 'high'
  ).length;
  const mediumPriorityCount = issues.filter(issue => issue.priority === 'medium').length;
  const lowPriorityCount = issues.filter(issue => issue.priority === 'low').length;

  // Generate smart bullet points
  const getBulletPoints = () => {
    const bullets = [];
    
    // Critical issues insight
    if (highPriorityCount > 0) {
      const immediateCount = issues.filter(issue => issue.priority === 'immediate').length;
      if (immediateCount > 0) {
        bullets.push(`${immediateCount} immediate safety concern${immediateCount > 1 ? 's' : ''} identified`);
      }
      if (highPriorityCount > immediateCount) {
        const highOnly = highPriorityCount - immediateCount;
        bullets.push(`${highOnly} high-priority repair${highOnly > 1 ? 's' : ''} need attention`);
      }
    }
    
    // Comparison to average
    const nationalAvg = 20.67;
    if (totalIssues < nationalAvg * 0.8) {
      bullets.push(`Fewer issues than typical (${nationalAvg.toFixed(0)} average)`);
    } else if (totalIssues > nationalAvg * 1.2) {
      bullets.push(`More issues than typical (${nationalAvg.toFixed(0)} average)`);
    }
    
    // Optional improvements insight
    if (lowPriorityCount > 0 && highPriorityCount === 0) {
      bullets.push(`Mostly optional improvements, no urgent repairs`);
    }
    
    return bullets.slice(0, 3); // Max 3 bullets
  };

  const bulletPoints = getBulletPoints();

  return (
    <MetricCard
      title="Issues Identified"
      bulletPoints={bulletPoints}
      bulletHeadline="Key findings:"
      showBullets={bulletPoints.length > 0}
      backgroundColor="bg-white"
      textColor="text-gray-900"
    >
      <div className="flex items-start justify-between">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-help flex-1">
              <div className="text-4xl font-bold mb-2 text-blue-600">
                {totalIssues}
              </div>
              
              {/* Priority breakdown bars */}
              <div className="flex gap-1 mb-2">
                {highPriorityCount > 0 && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center justify-center min-w-[24px]">
                    {highPriorityCount}
                  </div>
                )}
                {mediumPriorityCount > 0 && (
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center justify-center min-w-[24px]">
                    {mediumPriorityCount}
                  </div>
                )}
                {lowPriorityCount > 0 && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center justify-center min-w-[24px]">
                    {lowPriorityCount}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 text-xs text-gray-500">
                {highPriorityCount > 0 && <span>High</span>}
                {mediumPriorityCount > 0 && <span>Medium</span>}
                {lowPriorityCount > 0 && <span>Low</span>}
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Issues Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-700">High Priority</span>
                  </div>
                  <span className="font-bold text-red-700">{highPriorityCount}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-yellow-700">Medium Priority</span>
                  </div>
                  <span className="font-bold text-yellow-700">{mediumPriorityCount}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">Low Priority</span>
                  </div>
                  <span className="font-bold text-green-700">{lowPriorityCount}</span>
                </div>
                <div className="pt-2 border-t text-xs text-gray-600">
                  Issues are prioritized based on safety concerns and potential impact on the property.
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <Info className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
      </div>
    </MetricCard>
  );
};

export default IssuesFoundCard;
