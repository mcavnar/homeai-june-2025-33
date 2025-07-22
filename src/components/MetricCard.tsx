
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  bulletPoints?: string[];
  bulletHeadline?: string;
  showBullets?: boolean;
  gradientClass?: string;
  iconColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  children, 
  bulletPoints = [],
  bulletHeadline = "How this conclusion was reached:",
  showBullets = true,
  gradientClass,
  iconColor,
  textColor = "text-gray-900",
  backgroundColor = "bg-white"
}) => {
  // Use clean white background if no gradient specified
  const cardClass = gradientClass || backgroundColor;
  
  return (
    <Card className={`${cardClass} ${textColor} border shadow-sm h-full flex flex-col`}>
      <CardContent className="p-6 flex flex-col h-full">
        {/* Fixed height metric section for consistent alignment */}
        <div className="min-h-[140px] flex flex-col">
          {Icon && (
            <div className="flex items-center justify-between mb-3">
              <Icon className={`h-6 w-6 ${iconColor || 'text-green-500'}`} />
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <h3 className={`text-sm font-medium mb-3 ${iconColor || 'text-gray-600'}`}>{title}</h3>
            <div className="flex-1 flex items-start">
              {children}
            </div>
          </div>
        </div>
        
        {/* Bullet points section with proper formatting */}
        {showBullets && bulletPoints.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex-1">
            <p className={`text-sm ${iconColor || 'text-gray-600'} mb-3 font-medium`}>{bulletHeadline}</p>
            <ul className={`text-xs ${iconColor || 'text-gray-600'} space-y-2 list-disc list-outside ml-4`}>
              {bulletPoints.map((point, index) => (
                <li key={index} className="leading-relaxed pl-1">{point}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
