
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SystemCard from './SystemCard';
import ProjectionCards from './ProjectionCards';
import { type MajorSystems } from '@/types/inspection';

interface MajorSystemsProps {
  systems: MajorSystems;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  // Calculate total costs from all systems
  const calculateTotalCosts = () => {
    let fiveYear = { min: 0, max: 0 };
    let tenYear = { min: 0, max: 0 };

    Object.values(systems).forEach(system => {
      if (system && system.maintenanceCosts) {
        if (system.maintenanceCosts.fiveYear) {
          fiveYear.min += system.maintenanceCosts.fiveYear.min || 0;
          fiveYear.max += system.maintenanceCosts.fiveYear.max || 0;
        }
        if (system.maintenanceCosts.tenYear) {
          tenYear.min += system.maintenanceCosts.tenYear.min || 0;
          tenYear.max += system.maintenanceCosts.tenYear.max || 0;
        }
      }
    });

    return { fiveYear, tenYear };
  };

  const totalCosts = calculateTotalCosts();

  // Map system data to the props expected by SystemCard
  const mapSystemToCardProps = (key: string, system: any) => {
    return {
      title: system.name || key.charAt(0).toUpperCase() + key.slice(1),
      status: system.condition || 'Unknown',
      description: system.summary || 'No details available',
      repairCost: {
        min: system.repairCost?.min || 0,
        max: system.repairCost?.max || 5000,
      },
      maintenanceTips: system.maintenanceTips || ['Regular inspection recommended'],
      ctaText: `See Local ${key.charAt(0).toUpperCase() + key.slice(1)} Experts`,
      ctaType: key.toLowerCase() as 'hvac' | 'roofing' | 'plumbing' | 'electrical',
    };
  };

  return (
    <div className="space-y-6">
      {/* Projection Cards */}
      <ProjectionCards
        fiveYearTotal={totalCosts.fiveYear}
        tenYearTotal={totalCosts.tenYear}
      />

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(systems).map(([key, system]) => (
          <SystemCard
            key={key}
            {...mapSystemToCardProps(key, system)}
          />
        ))}
      </div>
    </div>
  );
};

export default MajorSystems;
