
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Zap, Droplets, Wind, Building } from 'lucide-react';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  const getSystemIcon = (systemName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (systemName.toLowerCase()) {
      case 'roof': return <Home {...iconProps} />;
      case 'electrical': return <Zap {...iconProps} />;
      case 'plumbing': return <Droplets {...iconProps} />;
      case 'hvac': return <Wind {...iconProps} />;
      case 'foundation': return <Building {...iconProps} />;
      default: return <Home {...iconProps} />;
    }
  };

  const getConditionColor = (condition: string) => {
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

  const getUrgencyColor = (yearsLeft: string) => {
    const years = parseInt(yearsLeft);
    if (years <= 0) {
      return 'bg-red-500 text-white';
    } else if (years <= 3) {
      return 'bg-orange-500 text-white';
    }
    return 'bg-green-500 text-white';
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
    <Card key={systemName} className="bg-white border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSystemIcon(systemName)}
            <CardTitle className="text-lg font-semibold text-gray-900">
              {displayName || systemName.charAt(0).toUpperCase() + systemName.slice(1)}
            </CardTitle>
          </div>
          <Badge className={`${getConditionColor(system.condition)} px-2 py-1 text-xs font-medium rounded`}>
            {system.condition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Brand:</span>
            <span className="text-sm font-medium text-gray-900">{system.brand || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Type:</span>
            <span className="text-sm font-medium text-gray-900">{system.type || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Age:</span>
            <span className="text-sm font-medium text-gray-900">{system.age || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Years Left:</span>
            <Badge className={`${getUrgencyColor(system.yearsLeft || '0')} px-2 py-1 text-xs font-medium rounded`}>
              {system.yearsLeft || '0'} years
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Define the priority order for the main systems
  const prioritySystems = ['roof', 'electrical', 'plumbing', 'hvac'];
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">5 Year Projection</h3>
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {formatCurrency(totalCosts.fiveYear)}
              </div>
              <p className="text-sm text-blue-700">
                Estimated maintenance costs for systems needing attention within 5 years
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">10 Year Projection</h3>
              <div className="text-3xl font-bold text-orange-900 mb-2">
                {formatCurrency(totalCosts.tenYear)}
              </div>
              <p className="text-sm text-orange-700">
                Estimated maintenance costs for systems needing attention within 10 years
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Systems - 2x2 Grid */}
      {mainSystems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mainSystems.map(systemName => {
            const displayName = systemName === 'plumbing' ? 'Plumbing' : 
                              systemName === 'electrical' ? 'Electrical' : 
                              systemName === 'hvac' ? 'HVAC' :
                              systemName.charAt(0).toUpperCase() + systemName.slice(1);
            return renderSystemCard(systemName, systems[systemName], displayName);
          })}
        </div>
      )}

      {/* Foundation system - full page width */}
      {foundationSystem && (
        <div>
          {renderSystemCard('foundation', foundationSystem, 'Foundation')}
        </div>
      )}
    </div>
  );
};

export default MajorSystems;
