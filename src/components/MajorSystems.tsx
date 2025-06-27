
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MajorSystems as MajorSystemsType } from '@/types/inspection';
import { formatCurrency } from '@/utils/formatters';

interface MajorSystemsProps {
  systems: MajorSystemsType;
}

const MajorSystems: React.FC<MajorSystemsProps> = ({ systems }) => {
  const getConditionColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
      return 'border-green-200 bg-green-50';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'border-yellow-200 bg-yellow-50';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'border-red-200 bg-red-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const getConditionTextColor = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('good') || lowerCondition.includes('excellent')) {
      return 'text-green-800 bg-green-100';
    } else if (lowerCondition.includes('fair') || lowerCondition.includes('satisfactory')) {
      return 'text-yellow-800 bg-yellow-100';
    } else if (lowerCondition.includes('poor') || lowerCondition.includes('immediate')) {
      return 'text-red-800 bg-red-100';
    }
    return 'text-gray-800 bg-gray-100';
  };

  const getCostRangeColor = (min: number, max: number) => {
    const avgCost = (min + max) / 2;
    if (avgCost < 1000) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (avgCost < 3000) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    } else {
      return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const formatSummaryAsBullets = (summary: string) => {
    // Split by common sentence endings and filter out empty strings
    const sentences = summary
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return sentences;
  };

  // Generate sample maintenance costs based on system type and condition
  const generateSampleMaintenanceCosts = (systemName: string, condition: string) => {
    const isGoodCondition = condition.toLowerCase().includes('good') || condition.toLowerCase().includes('excellent');
    const isFairCondition = condition.toLowerCase().includes('fair') || condition.toLowerCase().includes('satisfactory');
    
    let baseCosts: { fiveYear: { min: number, max: number }, tenYear: { min: number, max: number } };
    let repairs: { fiveYear: string[], tenYear: string[] };
    
    switch (systemName) {
      case 'hvac':
        baseCosts = {
          fiveYear: { min: 1500, max: 3000 },
          tenYear: { min: 3500, max: 7000 }
        };
        repairs = {
          fiveYear: ['Annual maintenance and tune-ups', 'Filter replacements', 'Minor component repairs'],
          tenYear: ['Compressor or blower motor replacement', 'Ductwork cleaning and sealing', 'Thermostat upgrades']
        };
        break;
      case 'electrical':
        baseCosts = {
          fiveYear: { min: 800, max: 1500 },
          tenYear: { min: 2000, max: 4000 }
        };
        repairs = {
          fiveYear: ['GFCI outlet installations', 'Switch and outlet replacements', 'Electrical safety inspections'],
          tenYear: ['Panel upgrades or repairs', 'Circuit additions', 'Whole-house surge protection']
        };
        break;
      case 'plumbing':
        baseCosts = {
          fiveYear: { min: 1000, max: 2000 },
          tenYear: { min: 2500, max: 5000 }
        };
        repairs = {
          fiveYear: ['Faucet and fixture repairs', 'Drain cleaning', 'Water heater maintenance'],
          tenYear: ['Water heater replacement', 'Pipe section replacements', 'Toilet and fixture upgrades']
        };
        break;
      case 'roof':
        baseCosts = {
          fiveYear: { min: 1200, max: 2500 },
          tenYear: { min: 3000, max: 8000 }
        };
        repairs = {
          fiveYear: ['Annual inspections', 'Minor leak repairs', 'Gutter cleaning and maintenance'],
          tenYear: ['Shingle replacements', 'Flashing repairs', 'Gutter system upgrades']
        };
        break;
      case 'foundation':
        baseCosts = {
          fiveYear: { min: 500, max: 1200 },
          tenYear: { min: 1500, max: 3500 }
        };
        repairs = {
          fiveYear: ['Crack sealing', 'Drainage maintenance', 'Moisture control'],
          tenYear: ['Waterproofing improvements', 'Structural assessments', 'Foundation settling repairs']
        };
        break;
      default:
        baseCosts = {
          fiveYear: { min: 500, max: 1000 },
          tenYear: { min: 1200, max: 2500 }
        };
        repairs = {
          fiveYear: ['Regular maintenance', 'Minor repairs'],
          tenYear: ['Major servicing', 'Component replacements']
        };
    }
    
    // Adjust costs based on condition
    const multiplier = isGoodCondition ? 0.8 : isFairCondition ? 1.0 : 1.3;
    
    return {
      fiveYear: {
        min: Math.round(baseCosts.fiveYear.min * multiplier),
        max: Math.round(baseCosts.fiveYear.max * multiplier)
      },
      tenYear: {
        min: Math.round(baseCosts.tenYear.min * multiplier),
        max: Math.round(baseCosts.tenYear.max * multiplier)
      }
    }, repairs;
  };

  const systemEntries = Object.entries(systems).filter(([_, system]) => system);

  if (systemEntries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Major Systems Assessment</h2>
        <p className="text-gray-600">Detailed evaluation of your property's key systems with future cost projections</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemEntries.map(([systemName, system]) => {
          // Use actual maintenance costs if available, otherwise generate sample data
          const [sampleCosts, sampleRepairs] = generateSampleMaintenanceCosts(systemName, system.condition);
          const maintenanceCosts = system.maintenanceCosts || sampleCosts;
          const anticipatedRepairs = system.anticipatedRepairs || sampleRepairs;

          return (
            <Card key={systemName} className={`${getConditionColor(system.condition)} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-900 capitalize">
                    {systemName}
                  </CardTitle>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getConditionTextColor(system.condition)}`}>
                    {system.condition}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Summary as bullets */}
                <div className="space-y-2">
                  {formatSummaryAsBullets(system.summary).map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1.5 text-xs">•</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
                
                {/* System Details */}
                {(system.brand || system.type || system.age || system.yearsLeft) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">System Details</h4>
                    <div className="space-y-1 text-sm">
                      {system.brand && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brand:</span>
                          <span className="text-gray-900 font-medium">{system.brand}</span>
                        </div>
                      )}
                      {system.type && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="text-gray-900 font-medium">{system.type}</span>
                        </div>
                      )}
                      {system.age && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="text-gray-900 font-medium">{system.age}</span>
                        </div>
                      )}
                      {system.yearsLeft && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Est. Years Left:</span>
                          <span className="text-gray-900 font-medium">{system.yearsLeft}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Replacement Cost */}
                {system.replacementCost && (
                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Replacement Cost</h4>
                    <div className="text-center">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(system.replacementCost.min)} - {formatCurrency(system.replacementCost.max)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Future Service Costs */}
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Future Service Costs</h4>
                  <div className="space-y-3">
                    {/* 5-Year Costs */}
                    <div className={`p-3 rounded-lg border ${getCostRangeColor(maintenanceCosts.fiveYear.min, maintenanceCosts.fiveYear.max)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Next 5 Years</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(maintenanceCosts.fiveYear.min)} - {formatCurrency(maintenanceCosts.fiveYear.max)}
                        </span>
                      </div>
                      {anticipatedRepairs.fiveYear && anticipatedRepairs.fiveYear.length > 0 && (
                        <div className="space-y-1">
                          {anticipatedRepairs.fiveYear.map((repair, index) => (
                            <div key={index} className="flex items-start gap-1">
                              <span className="text-xs mt-0.5">•</span>
                              <span className="text-xs leading-tight">{repair}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 10-Year Costs */}
                    <div className={`p-3 rounded-lg border ${getCostRangeColor(maintenanceCosts.tenYear.min, maintenanceCosts.tenYear.max)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Next 10 Years</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(maintenanceCosts.tenYear.min)} - {formatCurrency(maintenanceCosts.tenYear.max)}
                        </span>
                      </div>
                      {anticipatedRepairs.tenYear && anticipatedRepairs.tenYear.length > 0 && (
                        <div className="space-y-1">
                          {anticipatedRepairs.tenYear.map((repair, index) => (
                            <div key={index} className="flex items-start gap-1">
                              <span className="text-xs mt-0.5">•</span>
                              <span className="text-xs leading-tight">{repair}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MajorSystems;
