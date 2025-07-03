
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
    <Card className={`${cardClass} ${textColor} border shadow-sm`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Icon && (
            <div className="flex items-center justify-between">
              <Icon className={`h-6 w-6 ${iconColor || 'text-green-500'}`} />
            </div>
          )}
          <div className="space-y-2">
            <h3 className={`text-sm font-medium ${iconColor || 'text-gray-600'}`}>{title}</h3>
            {children}
            {showBullets && bulletPoints.length > 0 && (
              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className={`text-sm ${iconColor || 'text-gray-600'} mb-2`}>{bulletHeadline}</p>
                <ul className={`text-xs ${iconColor || 'text-gray-600'} space-y-1`}>
                  {bulletPoints.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
