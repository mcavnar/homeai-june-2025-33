
import { Home, Zap, Droplets, Wind, Building } from 'lucide-react';

export const getSystemIcon = (systemName: string) => {
  const iconProps = { className: "h-5 w-5" };
  switch (systemName.toLowerCase()) {
    case 'roof': return Home;
    case 'electrical': return Zap;
    case 'plumbing': return Droplets;
    case 'hvac': return Wind;
    case 'foundation': return Building;
    default: return Home;
  }
};

export const getConditionColor = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
    return 'bg-green-100 text-green-800 border-green-200';
  } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getUrgencyColor = (yearsLeft: string) => {
  const years = parseInt(yearsLeft);
  if (years <= 0) {
    return 'bg-red-100 text-red-800 border-red-200';
  } else if (years <= 3) {
    return 'bg-orange-100 text-orange-800 border-orange-200';
  }
  return 'bg-green-100 text-green-800 border-green-200';
};

export const parseYearsLeft = (yearsLeft: string | undefined) => {
  if (!yearsLeft) return [{ label: 'N/A', value: '0' }];
  
  // Check if it contains multiple units (look for patterns like "Unit 1: X years, Unit 2: Y years" or "5 years / 8 years")
  if (yearsLeft.includes('Unit') || yearsLeft.includes('/') || yearsLeft.includes(',')) {
    const units = [];
    
    // Handle "Unit 1: X years, Unit 2: Y years" format
    if (yearsLeft.includes('Unit')) {
      const unitMatches = yearsLeft.match(/Unit\s*(\d+):\s*(\d+)\s*years?/gi);
      if (unitMatches) {
        unitMatches.forEach(match => {
          const unitMatch = match.match(/Unit\s*(\d+):\s*(\d+)/i);
          if (unitMatch) {
            units.push({
              label: `Unit ${unitMatch[1]}`,
              value: unitMatch[2]
            });
          }
        });
      }
    }
    // Handle "X years / Y years" or "X / Y" format
    else if (yearsLeft.includes('/')) {
      const parts = yearsLeft.split('/').map(part => part.trim().replace(/\s*years?\s*/i, ''));
      parts.forEach((part, index) => {
        if (part && !isNaN(parseInt(part))) {
          units.push({
            label: `Unit ${index + 1}`,
            value: part
          });
        }
      });
    }
    // Handle comma-separated format
    else if (yearsLeft.includes(',')) {
      const parts = yearsLeft.split(',').map(part => part.trim().replace(/\s*years?\s*/i, ''));
      parts.forEach((part, index) => {
        if (part && !isNaN(parseInt(part))) {
          units.push({
            label: `Unit ${index + 1}`,
            value: part
          });
        }
      });
    }
    
    return units.length > 0 ? units : [{ label: 'N/A', value: '0' }];
  }
  
  // Single unit
  const numericValue = yearsLeft.replace(/\s*years?\s*/i, '').trim();
  return [{ label: '', value: numericValue }];
};

export const calculateTotalMaintenanceCosts = (systems: any) => {
  let fiveYearTotal = 0;
  let tenYearTotal = 0;

  Object.values(systems).forEach((system: any) => {
    if (system?.maintenanceCosts) {
      fiveYearTotal += (system.maintenanceCosts.fiveYear.min + system.maintenanceCosts.fiveYear.max) / 2;
      tenYearTotal += (system.maintenanceCosts.tenYear.min + system.maintenanceCosts.tenYear.max) / 2;
    }
  });

  return { fiveYear: fiveYearTotal, tenYear: tenYearTotal };
};
