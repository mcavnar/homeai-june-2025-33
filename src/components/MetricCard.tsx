
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
        {/* Header Section - Fixed Height */}
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        {/* Main Metric Section - Expanded Height */}
        <div className="px-4 sm:px-6 pb-4 flex-1 flex flex-col justify-center items-center min-h-[200px]">
          {children}
        </div>
        
        {/* Context Bullets Section - Only show if showBullets is true */}
        {showBullets && (
          <>
            <div className="border-t border-gray-100 mx-4 sm:mx-6"></div>
            <div className="p-3 sm:p-6 pt-6 min-h-24 flex flex-col items-start overflow-hidden">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">{bulletHeadline}</h4>
              <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 w-full break-words leading-tight">
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
