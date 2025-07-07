
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ProjectionCardsProps {
  fiveYearTotal: { min: number; max: number };
  tenYearTotal: { min: number; max: number };
}

const ProjectionCards: React.FC<ProjectionCardsProps> = ({ fiveYearTotal, tenYearTotal }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-600">5-Year Maintenance Projection</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(fiveYearTotal.min)} - {formatCurrency(fiveYearTotal.max)}
            </p>
            <p className="text-sm text-gray-600">Expected maintenance costs over 5 years</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-600">10-Year Maintenance Projection</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(tenYearTotal.min)} - {formatCurrency(tenYearTotal.max)}
            </p>
            <p className="text-sm text-gray-600">Expected maintenance costs over 10 years</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectionCards;
