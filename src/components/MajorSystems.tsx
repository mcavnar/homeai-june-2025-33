
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SystemCard from './SystemCard';
import ProjectionCards from './ProjectionCards';
import { type MajorSystems } from '@/types/inspection';

interface MajorSystemsProps {
  systems: MajorSystems;
  propertyAddress?: string;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems, propertyAddress }) => {
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
      description: system.summary,
      repairCost: system.repairCost,
      maintenanceTips: system.maintenanceTips,
      ctaText: `See Local ${key.charAt(0).toUpperCase() + key.slice(1)} Experts`,
      ctaType: key.toLowerCase() as 'hvac' | 'roofing' | 'plumbing' | 'electrical',
      propertyAddress,
      // Pass detailed system information
      age: system.age,
      yearsLeft: system.yearsLeft,
      type: system.type,
      replacementCost: system.replacementCost,
      maintenanceCosts: system.maintenanceCosts,
      anticipatedRepairs: system.anticipatedRepairs,
    };
  };

  return (
    <div className="space-y-6">
      {/* Projection Cards */}
      <ProjectionCards
        fiveYearTotal={totalCosts.fiveYear}
        tenYearTotal={totalCosts.tenYear}
      />

      {/* Systems Grid - Structured Layout */}
      <div className="space-y-6">
        {/* Row 1: HVAC and Roof */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.hvac && (
            <SystemCard
              {...mapSystemToCardProps('hvac', systems.hvac)}
            />
          )}
          {systems.roof && (
            <SystemCard
              {...mapSystemToCardProps('roof', systems.roof)}
              ctaType="roofing"
            />
          )}
        </div>

        {/* Row 2: Plumbing and Electrical */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.plumbing && (
            <SystemCard
              {...mapSystemToCardProps('plumbing', systems.plumbing)}
            />
          )}
          {systems.electrical && (
            <SystemCard
              {...mapSystemToCardProps('electrical', systems.electrical)}
            />
          )}
        </div>

        {/* Row 3: Foundation (Full Width) */}
        <div className="grid grid-cols-1 gap-6">
          {systems.foundation && (
            <SystemCard
              {...mapSystemToCardProps('foundation', systems.foundation)}
              ctaType="recommended_providers"
              ctaText="See Local Foundation Experts"
              propertyAddress={propertyAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MajorSystems;
