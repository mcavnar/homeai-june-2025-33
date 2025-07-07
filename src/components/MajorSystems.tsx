
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SystemCard from './SystemCard';
import ProjectionCards from './ProjectionCards';
import { MajorSystemsType } from '@/types/inspection';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  // Calculate total costs from all systems
  const calculateTotalCosts = () => {
    let fiveYear = { min: 0, max: 0 };
    let tenYear = { min: 0, max: 0 };

    Object.values(systems).forEach(system => {
      if (system.maintenanceProjection) {
        if (system.maintenanceProjection.fiveYear) {
          fiveYear.min += system.maintenanceProjection.fiveYear.min || 0;
          fiveYear.max += system.maintenanceProjection.fiveYear.max || 0;
        }
        if (system.maintenanceProjection.tenYear) {
          tenYear.min += system.maintenanceProjection.tenYear.min || 0;
          tenYear.max += system.maintenanceProjection.tenYear.max || 0;
        }
      }
    });

    return { fiveYear, tenYear };
  };

  const totalCosts = calculateTotalCosts();

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
          <SystemCard key={key} system={system} />
        ))}
      </div>
    </div>
  );
};

export default MajorSystems;
