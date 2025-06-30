
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Zap, Droplets, Wind, Building, Thermometer } from 'lucide-react';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  const getSystemIcon = (systemName: string) => {
    const iconProps = { className: "h-6 w-6" };
    switch (systemName.toLowerCase()) {
      case 'roof': return <Home {...iconProps} />;
      case 'electrical': return <Zap {...iconProps} />;
      case 'plumbing': return <Droplets {...iconProps} />;
      case 'hvac': return <Wind {...iconProps} />;
      case 'foundation': return <Building {...iconProps} />;
      case 'water heater': return <Thermometer {...iconProps} />;
      default: return <Home {...iconProps} />;
    }
  };

  const getConditionColor = (condition: string) => {
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

  const getConditionBadgeColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
      return 'bg-green-500 text-white';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'bg-yellow-500 text-white';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'bg-red-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  const getYearsLeftColor = (yearsLeft: string) => {
    const years = parseInt(yearsLeft);
    if (years <= 0) {
      return 'text-red-600';
    } else if (years <= 3) {
      return 'text-orange-600';
    }
    return 'text-green-600';
  };

  const getYearsLeftIcon = (yearsLeft: string) => {
    const years = parseInt(yearsLeft);
    if (years <= 0) {
      return '⚠️';
    } else if (years <= 3) {
      return '⚠️';
    }
    return '✅';
  };

  // Calculate total maintenance costs
  const calculateTotalMaintenanceCosts = () => {
    let fiveYearTotal = 0;
    let tenYearTotal = 0;

    Object.values(systems).forEach(system => {
      if (system?.maintenanceCosts) {
        fiveYearTotal += (system.maintenanceCosts.fiveYear.min + system.maintenanceCosts.fiveYear.max) / 2;
        tenYearTotal += (system.maintenanceCosts.tenYear.min + system.maintenanceCosts.tenYear.max) / 2;
      }
    });

    return { fiveYear: fiveYearTotal, tenYear: tenYearTotal };
  };

  const totalCosts = calculateTotalMaintenanceCosts();

  const renderSystemCard = (systemName: string, system: any, displayName?: string) => (
    <Card key={systemName} className="bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getSystemIcon(systemName)}
            <CardTitle className="text-lg font-semibold text-gray-900">
              {displayName || systemName.charAt(0).toUpperCase() + systemName.slice(1)} System
            </CardTitle>
          </div>
          <Badge className={`${getConditionBadgeColor(system.condition)} font-medium px-3 py-1 rounded-full`}>
            {system.condition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600 font-medium">Brand:</span>
            <p className="text-sm font-semibold text-gray-900">{system.brand || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 font-medium">Type:</span>
            <p className="text-sm font-semibold text-gray-900">{system.type || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600 font-medium">Age:</span>
            <p className="text-sm font-semibold text-gray-900">{system.age || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 font-medium">Years Left:</span>
            <p className={`text-sm font-semibold flex items-center gap-1 ${getYearsLeftColor(system.yearsLeft || '0')}`}>
              <span>{getYearsLeftIcon(system.yearsLeft || '0')}</span>
              {system.yearsLeft || '0 years'}
            </p>
          </div>
        </div>

        {system.replacementCost && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Replacement Cost:</span>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(system.replacementCost.min)} - {formatCurrency(system.replacementCost.max)}
            </p>
          </div>
        )}

        <div className="pt-2">
          {system.yearsLeft && parseInt(system.yearsLeft) <= 0 ? (
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              Replace Now
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              Future Planning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Define the priority order for the main systems
  const prioritySystems = ['hvac', 'plumbing', 'roof', 'electrical'];
  const mainSystems = prioritySystems.filter(systemName => systems[systemName]);
  const foundationSystem = systems.foundation;

  if (mainSystems.length === 0 && !foundationSystem) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Key Systems</h2>
      </div>
      
      {/* Projection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-yellow-800">5-Year Projection</h3>
              <span className="text-gray-400">ⓘ</span>
            </div>
            <div className="text-3xl font-bold text-yellow-800 mb-2">
              {formatCurrency(totalCosts.fiveYear)}
            </div>
            <p className="text-sm text-gray-600">
              Estimated maintenance costs for systems needing attention within 5 years
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-orange-800">10-Year Projection</h3>
              <span className="text-gray-400">ⓘ</span>
            </div>
            <div className="text-3xl font-bold text-orange-800 mb-2">
              {formatCurrency(totalCosts.tenYear)}
            </div>
            <p className="text-sm text-gray-600">
              Estimated maintenance costs for systems needing attention within 10 years
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Systems - 2x2 Grid */}
      {mainSystems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainSystems.map(systemName => {
            const displayName = systemName === 'plumbing' ? 'Water Heater' : 
                              systemName === 'electrical' ? 'Electrical Panel' : 
                              systemName.charAt(0).toUpperCase() + systemName.slice(1);
            return renderSystemCard(systemName, systems[systemName], displayName);
          })}
        </div>
      )}

      {/* Foundation system - full page width */}
      {foundationSystem && (
        <div>
          {renderSystemCard('foundation', foundationSystem)}
        </div>
      )}
    </div>
  );
};

export default MajorSystems;
