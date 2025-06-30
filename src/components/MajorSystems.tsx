
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Home, Zap, Droplets, Wind, Building, ChevronDown } from 'lucide-react';
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
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getUrgencyColor = (yearsLeft: string) => {
    const years = parseInt(yearsLeft);
    if (years <= 0) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (years <= 3) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const parseYearsLeft = (yearsLeft: string | undefined) => {
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

  const renderSystemCard = (systemName: string, system: any, displayName?: string) => {
    const yearsLeftData = parseYearsLeft(system.yearsLeft);
    const shouldShowBrand = systemName !== 'roof' && systemName !== 'electrical';
    
    return (
      <Card key={systemName} className="bg-white border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSystemIcon(systemName)}
              <CardTitle className="text-lg font-semibold text-gray-900">
                {displayName || systemName.charAt(0).toUpperCase() + systemName.slice(1)}
              </CardTitle>
            </div>
            <span className={`${getConditionColor(system.condition)} px-3 py-1 text-xs font-medium rounded-full border`}>
              {system.condition}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Grid layout for main information */}
          <div className={`grid gap-x-6 gap-y-4 p-4 bg-gray-50 rounded-lg ${shouldShowBrand ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {shouldShowBrand ? (
              <>
                {/* First row: Brand and Type */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand</span>
                  <div className="text-sm font-medium text-gray-900">{system.brand || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                  <div className="text-sm font-medium text-gray-900">{system.type || 'N/A'}</div>
                </div>
                
                {/* Second row: Age and Years Left */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</span>
                  <div className="text-sm font-medium text-gray-900">{system.age || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Years Left</span>
                  <div className="flex flex-wrap gap-1">
                    {yearsLeftData.map((unit, index) => (
                      <span 
                        key={index}
                        className={`${getUrgencyColor(unit.value)} px-2 py-1 text-xs font-medium rounded-md border`}
                      >
                        {unit.label && `${unit.label}: `}{unit.value} years
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* First row: Type and Age */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                  <div className="text-sm font-medium text-gray-900">{system.type || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</span>
                  <div className="text-sm font-medium text-gray-900">{system.age || 'N/A'}</div>
                </div>
                
                {/* Second row: Years Left (spans both columns) */}
                <div className="space-y-1 col-span-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Years Left</span>
                  <div className="flex flex-wrap gap-1">
                    {yearsLeftData.map((unit, index) => (
                      <span 
                        key={index}
                        className={`${getUrgencyColor(unit.value)} px-2 py-1 text-xs font-medium rounded-md border`}
                      >
                        {unit.label && `${unit.label}: `}{unit.value} years
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                More Details
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4 pt-4 border-t border-gray-200">
              {system.summary && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-sm text-gray-600">{system.summary}</p>
                </div>
              )}
              
              {system.replacementCost && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Replacement Cost</h4>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(system.replacementCost.min)} - {formatCurrency(system.replacementCost.max)}
                  </p>
                </div>
              )}

              {system.maintenanceCosts && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Maintenance Costs</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">5-Year:</span>
                      <span className="text-gray-900">
                        {formatCurrency(system.maintenanceCosts.fiveYear.min)} - {formatCurrency(system.maintenanceCosts.fiveYear.max)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">10-Year:</span>
                      <span className="text-gray-900">
                        {formatCurrency(system.maintenanceCosts.tenYear.min)} - {formatCurrency(system.maintenanceCosts.tenYear.max)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {system.anticipatedRepairs && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Anticipated Repairs</h4>
                  {system.anticipatedRepairs.fiveYear && system.anticipatedRepairs.fiveYear.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-700">5-Year:</span>
                      <ul className="text-sm text-gray-600 ml-2 list-disc list-inside">
                        {system.anticipatedRepairs.fiveYear.map((repair: string, index: number) => (
                          <li key={index}>{repair}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {system.anticipatedRepairs.tenYear && system.anticipatedRepairs.tenYear.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-700">10-Year:</span>
                      <ul className="text-sm text-gray-600 ml-2 list-disc list-inside">
                        {system.anticipatedRepairs.tenYear.map((repair: string, index: number) => (
                          <li key={index}>{repair}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    );
  };

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
