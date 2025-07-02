
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  bulletPoints?: string[];
  bulletHeadline?: string;
  showBullets?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  children, 
  bulletPoints = [],
  bulletHeadline = "How this conclusion was reached:",
  showBullets = true
}) => {
  return (
    <Card className="border-indigo-200">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-3 pb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        {/* Main Metric Section - Top aligned */}
        <div className="px-3 pb-3 flex-1 flex flex-col justify-start items-center min-h-[100px] pt-2">
          {children}
        </div>
        
        {/* Context Bullets Section - Only show if showBullets is true */}
        {showBullets && (
          <>
            <div className="border-t border-gray-100 mx-3"></div>
            <div className="p-3 pt-3 min-h-16 flex flex-col items-start overflow-hidden">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">{bulletHeadline}</h4>
              <ul className="text-[10px] text-gray-600 space-y-0.5 w-full break-words leading-tight">
                {bulletPoints.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
