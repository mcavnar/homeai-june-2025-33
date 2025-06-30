
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  bulletPoints: string[];
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  children, 
  bulletPoints 
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
        
        {/* Main Metric Section - Reduced Padding */}
        <div className="px-4 sm:px-6 pb-2 h-48 flex flex-col justify-center items-center">
          {children}
        </div>
        
        {/* Visual Separator */}
        <div className="border-t border-gray-100 mx-4 sm:mx-6"></div>
        
        {/* Context Bullets Section - Responsive and Overflow Protected */}
        <div className="p-3 sm:p-6 pt-6 min-h-24 flex items-start overflow-hidden">
          <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 w-full break-words leading-tight">
            {bulletPoints.map((point, index) => (
              <li key={index}>• {point}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
