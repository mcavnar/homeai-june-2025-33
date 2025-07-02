
import React from 'react';
import { Calendar, CalendarClock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import MetricCard from './MetricCard';

interface ProjectionCardsProps {
  fiveYearTotal: number;
  tenYearTotal: number;
}

const ProjectionCards: React.FC<ProjectionCardsProps> = ({ fiveYearTotal, tenYearTotal }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <MetricCard
        icon={Calendar}
        title="5 Year Projection"
        showBullets={false}
        gradientClass="bg-gradient-to-br from-blue-500 to-blue-600"
        iconColor="text-blue-100"
        textColor="text-white"
      >
        <div className="text-3xl font-bold mb-2">
          {formatCurrency(fiveYearTotal)}
        </div>
        <p className="text-sm text-blue-100">
          Estimated maintenance costs for systems needing attention within 5 years
        </p>
      </MetricCard>

      <MetricCard
        icon={CalendarClock}
        title="10 Year Projection"
        showBullets={false}
        gradientClass="bg-gradient-to-br from-orange-500 to-orange-600"
        iconColor="text-orange-100"
        textColor="text-white"
      >
        <div className="text-3xl font-bold mb-2">
          {formatCurrency(tenYearTotal)}
        </div>
        <p className="text-sm text-orange-100">
          Estimated maintenance costs for systems needing attention within 10 years
        </p>
      </MetricCard>
    </div>
  );
};

export default ProjectionCards;
