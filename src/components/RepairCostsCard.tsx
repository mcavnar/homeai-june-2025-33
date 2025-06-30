
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
    'Labor and material estimates updated weekly for local markets',
    'Current market rates drawn from a database of millions of contractor bids',
    'Costs will vary by contractor but represent average prices in the property\'s area'
  ];

  return (
    <MetricCard
      icon={Wrench}
      title="Total Repair Costs"
      bulletPoints={bulletPoints}
      bulletHeadline="Cost Factors Considered"
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
