
import React from 'react';
import { Wrench } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatCurrency } from '@/utils/formatters';

interface RepairCostsCardProps {
  totalRepairCost: number;
}

const RepairCostsCard: React.FC<RepairCostsCardProps> = ({ 
  totalRepairCost 
}) => {
  const bulletPoints = [
    'Labor and material estimates',
    'Current market rates',
    'Worst-case scenario costs'
  ];

  return (
    <MetricCard
      icon={Wrench}
      title="Total Repair Costs"
      bulletPoints={bulletPoints}
    >
      <div className="text-4xl font-bold text-red-600 mb-2">
        {formatCurrency(totalRepairCost)}
      </div>
      <div className="text-sm text-gray-600">
        Estimated maximum cost
      </div>
    </MetricCard>
  );
};

export default RepairCostsCard;
