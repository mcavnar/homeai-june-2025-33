import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Home, Zap, Droplets, Wind, Building } from 'lucide-react';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({});

  const getSystemIcon = (systemName: string) => {
    const iconProps = { className: "h-6 w-6" };
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

  const getConditionCardBorder = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
      return 'border-l-green-500';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'border-l-yellow-500';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'border-l-red-500';
    }
    return 'border-l-gray-500';
  };

  const getCostSeverity = (cost: number) => {
    if (cost < 1000) return 'low';
    if (cost < 5000) return 'medium';
    return 'high';
  };

  const getCostSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleExpanded = (systemName: string) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemName]: !prev[systemName]
    }));
  };

  const getMaintenanceProgressBar = (fiveYear: number, tenYear: number) => {
    const maxCost = Math.max(fiveYear, tenYear, 5000);
    const fiveYearPercent = (fiveYear / maxCost) * 100;
    const tenYearPercent = (tenYear / maxCost) * 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>5-Year Cost</span>
          <span>{formatCurrency(fiveYear)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getCostSeverityColor(getCostSeverity(fiveYear))}`}
            style={{ width: `${Math.min(fiveYearPercent, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-600 mt-3">
          <span>10-Year Cost</span>
          <span>{formatCurrency(tenYear)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getCostSeverityColor(getCostSeverity(tenYear))}`}
            style={{ width: `${Math.min(tenYearPercent, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const renderSystemCard = (systemName: string, system: any) => (
    <Card key={systemName} className={`border-l-4 ${getConditionCardBorder(system.condition)} hover:shadow-lg transition-all duration-200`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getSystemIcon(systemName)}
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 capitalize">
                {systemName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {system.age && (
                  <Badge variant="outline" className="text-xs">
                    {system.age}
                  </Badge>
                )}
                {system.yearsLeft && (
                  <Badge variant="outline" className="text-xs">
                    {system.yearsLeft} left
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Badge className={`${getConditionColor(system.condition)} font-semibold px-3 py-1`}>
            {system.condition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Status */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 font-medium">
            {system.summary.split('.')[0]}.
          </p>
        </div>

        {/* Replacement Cost - Prominent Display */}
        {system.replacementCost && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Replacement Cost</h4>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-900">
                {formatCurrency(system.replacementCost.min)} - {formatCurrency(system.replacementCost.max)}
              </span>
            </div>
          </div>
        )}

        {/* Maintenance Timeline */}
        {system.maintenanceCosts && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Maintenance Timeline</h4>
            {getMaintenanceProgressBar(
              (system.maintenanceCosts.fiveYear.min + system.maintenanceCosts.fiveYear.max) / 2,
              (system.maintenanceCosts.tenYear.min + system.maintenanceCosts.tenYear.max) / 2
            )}
          </div>
        )}

        {/* Expandable Details */}
        <Collapsible 
          open={expandedSystems[systemName]} 
          onOpenChange={() => toggleExpanded(systemName)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <span className="text-sm font-medium">View Details</span>
              {expandedSystems[systemName] ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-3">
            {/* Full Summary */}
            <div className="text-sm text-gray-700 leading-relaxed">
              {system.summary}
            </div>

            {/* System Details */}
            {(system.brand || system.type) && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h5 className="font-medium text-gray-900 text-sm">System Details</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {system.brand && (
                    <div>
                      <span className="text-gray-600">Brand:</span>
                      <span className="ml-2 font-medium">{system.brand}</span>
                    </div>
                  )}
                  {system.type && (
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{system.type}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Maintenance Costs */}
            {system.maintenanceCosts && (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900 text-sm">Detailed Maintenance Costs</h5>
                
                <div className="space-y-3">
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-yellow-900">Next 5 Years</span>
                      <span className="text-sm font-semibold text-yellow-900">
                        {formatCurrency(system.maintenanceCosts.fiveYear.min)} - {formatCurrency(system.maintenanceCosts.fiveYear.max)}
                      </span>
                    </div>
                    {system.anticipatedRepairs?.fiveYear && system.anticipatedRepairs.fiveYear.length > 0 && (
                      <ul className="text-xs text-yellow-800 space-y-1">
                        {system.anticipatedRepairs.fiveYear.map((repair, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>{repair}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-orange-900">Next 10 Years</span>
                      <span className="text-sm font-semibold text-orange-900">
                        {formatCurrency(system.maintenanceCosts.tenYear.min)} - {formatCurrency(system.maintenanceCosts.tenYear.max)}
                      </span>
                    </div>
                    {system.anticipatedRepairs?.tenYear && system.anticipatedRepairs.tenYear.length > 0 && (
                      <ul className="text-xs text-orange-800 space-y-1">
                        {system.anticipatedRepairs.tenYear.map((repair, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>{repair}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );

  // Define the priority order for the 2x2 grid
  const prioritySystems = ['roof', 'electrical', 'plumbing', 'hvac'];
  const gridSystems = prioritySystems.filter(systemName => systems[systemName]);
  const foundationSystem = systems.foundation;
  
  // Get any remaining systems that aren't in the priority list or foundation
  const otherSystems = Object.entries(systems).filter(([systemName, system]) => 
    system && !prioritySystems.includes(systemName) && systemName !== 'foundation'
  );

  if (gridSystems.length === 0 && !foundationSystem && otherSystems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Major Systems Assessment</h2>
        <p className="text-gray-600 text-lg">Quick overview of your property's key systems</p>
      </div>
      
      {/* 2x2 Grid for priority systems */}
      {gridSystems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gridSystems.map(systemName => renderSystemCard(systemName, systems[systemName]))}
        </div>
      )}

      {/* Foundation system - always underneath */}
      {foundationSystem && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {renderSystemCard('foundation', foundationSystem)}
        </div>
      )}

      {/* Any other systems */}
      {otherSystems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {otherSystems.map(([systemName, system]) => renderSystemCard(systemName, system))}
        </div>
      )}
    </div>
  );
};

export default MajorSystems;
