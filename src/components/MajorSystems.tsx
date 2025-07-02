
import React from 'react';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';
import { calculateTotalMaintenanceCosts } from '@/utils/systemUtils';
import ProjectionCards from './ProjectionCards';
import SystemCard from './SystemCard';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  const totalCosts = calculateTotalMaintenanceCosts(systems);

  // Define the priority order for the main systems
  const prioritySystems = ['roof', 'electrical', 'plumbing', 'hvac'];
  const mainSystems = prioritySystems.filter(systemName => systems[systemName]);
  const foundationSystem = systems.foundation;

  if (mainSystems.length === 0 && !foundationSystem) {
    return null;
  }

  const getDisplayName = (systemName: string) => {
    const displayNames: { [key: string]: string } = {
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      hvac: 'HVAC'
    };
    return displayNames[systemName] || systemName.charAt(0).toUpperCase() + systemName.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Projection Cards */}
      <ProjectionCards 
        fiveYearTotal={totalCosts.fiveYear} 
        tenYearTotal={totalCosts.tenYear} 
      />

      {/* Main Systems - 2x2 Grid */}
      {mainSystems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mainSystems.map(systemName => (
            <SystemCard
              key={systemName}
              systemName={systemName}
              system={systems[systemName]}
              displayName={getDisplayName(systemName)}
            />
          ))}
        </div>
      )}

      {/* Foundation system - full page width */}
      {foundationSystem && (
        <div>
          <SystemCard
            systemName="foundation"
            system={foundationSystem}
            displayName="Foundation"
          />
        </div>
      )}
    </div>
  );
};

export default MajorSystems;
