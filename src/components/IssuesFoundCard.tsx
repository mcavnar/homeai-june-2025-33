
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
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-start justify-between w-full cursor-help">
            <div className="flex-1">
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
              
              <div className="flex gap-1 text-xs text-gray-500">
                {highPriorityCount > 0 && (
                  <div className="flex items-center justify-center min-w-[24px]">
                    <span>High</span>
                  </div>
                )}
                {mediumPriorityCount > 0 && (
                  <div className="flex items-center justify-center min-w-[24px]">
                    <span>Med</span>
                  </div>
                )}
                {lowPriorityCount > 0 && (
                  <div className="flex items-center justify-center min-w-[24px]">
                    <span>Low</span>
                  </div>
                )}
              </div>
            </div>
            <Info className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="text-xs text-gray-600 space-y-2">
            <p className="font-medium">How We Categorize Issues:</p>
            <p>Our AI analyzes inspection reports to identify and categorize issues across 8 main areas: Electrical, Plumbing, HVAC, Roofing, Structural, Exterior, Interior, and Safety.</p>
            <div className="space-y-1">
              <p><span className="font-medium text-red-600">• Immediate:</span> Safety hazards, code violations, and urgent repairs</p>
              <p><span className="font-medium text-orange-600">• High:</span> Major system problems and structural concerns</p>
              <p><span className="font-medium text-yellow-600">• Medium:</span> Issues that could worsen if ignored and efficiency improvements</p>
              <p><span className="font-medium text-green-600">• Low:</span> Routine maintenance and preventive care recommendations</p>
            </div>
            <p>The analysis targets 15-25+ findings across all systems to provide comprehensive coverage from critical repairs to long-term maintenance planning.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </MetricCard>
  );
};

export default IssuesFoundCard;
