
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
  gradientClass?: string;
  iconColor?: string;
  textColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  children, 
  bulletPoints = [],
  bulletHeadline = "How this conclusion was reached:",
  showBullets = true,
  gradientClass = "bg-gradient-to-br from-blue-500 to-blue-600",
  iconColor = "text-blue-100",
  textColor = "text-white"
}) => {
  return (
    <Card className={`${gradientClass} ${textColor} border-0`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="space-y-2">
          <h3 className={`text-lg font-semibold ${iconColor}`}>{title}</h3>
          {children}
          {showBullets && bulletPoints.length > 0 && (
            <div className="mt-4 pt-2 border-t border-white/20">
              <p className={`text-sm ${iconColor} mb-2`}>{bulletHeadline}</p>
              <ul className={`text-xs ${iconColor} space-y-1`}>
                {bulletPoints.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
