
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
  
  // Count issues by actual priority levels in the data
  const highPriorityCount = issues.filter(issue => issue.priority === 'high').length;
  const mediumPriorityCount = issues.filter(issue => issue.priority === 'medium').length;
  const lowPriorityCount = issues.filter(issue => issue.priority === 'low').length;

  // Get most common categories from actual issues
  const getCategoryInsights = () => {
    const categoryCounts: { [key: string]: number } = {};
    issues.forEach(issue => {
      categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
    });
    
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
    
    return sortedCategories;
  };

  // Generate smart bullet points based on actual data
  const getBulletPoints = () => {
    const bullets = [];
    const nationalAvg = 20.67;
    const topCategories = getCategoryInsights();
    
    // Priority breakdown insight
    if (highPriorityCount > 0) {
      bullets.push(`${highPriorityCount} high-priority repair${highPriorityCount > 1 ? 's' : ''} need attention`);
    } else if (mediumPriorityCount > 0 && lowPriorityCount > 0) {
      bullets.push(`No high-priority issues - mostly medium and low priority items`);
    } else {
      bullets.push(`All issues are low priority - no urgent repairs needed`);
    }
    
    // Comparison to national average
    if (totalIssues < nationalAvg * 0.8) {
      bullets.push(`Fewer issues than typical (${totalIssues} vs ${nationalAvg.toFixed(0)} average)`);
    } else if (totalIssues > nationalAvg * 1.2) {
      bullets.push(`More issues than typical (${totalIssues} vs ${nationalAvg.toFixed(0)} average)`);
    } else {
      bullets.push(`Issue count near average (${totalIssues} vs ${nationalAvg.toFixed(0)} average)`);
    }
    
    // Category insights from actual data
    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      if (topCategories.length > 1 && topCategories[0][1] === topCategories[1][1]) {
        // Tie for most common
        bullets.push(`Most common: ${topCategory[0]} and ${topCategories[1][0]} (${topCategory[1]} each)`);
      } else {
        bullets.push(`Most common category: ${topCategory[0]} (${topCategory[1]} issue${topCategory[1] > 1 ? 's' : ''})`);
      }
    } else {
      bullets.push(`No major category concentrations identified`);
    }
    
    return bullets.slice(0, 3); // Ensure exactly 3 bullets
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
      <div className="flex items-start justify-between w-full">
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
