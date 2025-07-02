import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { getSystemIcon, getConditionColor, getUrgencyColor, parseYearsLeft } from '@/utils/systemUtils';

interface SystemCardProps {
  systemName: string;
  system: any;
  displayName?: string;
}

const SystemCard: React.FC<SystemCardProps> = ({ systemName, system, displayName }) => {
  const Icon = getSystemIcon(systemName);
  const yearsLeftData = parseYearsLeft(system.yearsLeft);
  const shouldShowBrand = systemName !== 'roof' && systemName !== 'electrical' && systemName !== 'foundation';
  const isFoundation = systemName === 'foundation';
  const isRoof = systemName === 'roof';
  
  const handleRoofingExpertClick = () => {
    // This could be expanded to open a modal, navigate to a contact form, etc.
    console.log('Roofing expert button clicked');
  };
  
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
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
        <div className={`grid gap-x-6 gap-y-4 p-4 bg-gray-50 rounded-lg ${
          isFoundation 
            ? 'grid-cols-3' 
            : shouldShowBrand 
              ? 'grid-cols-2' 
              : 'grid-cols-2'
        }`}>
          {isFoundation ? (
            <>
              {/* Foundation: Single row with three columns */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                <div className="text-sm font-medium text-gray-900">{system.type || 'N/A'}</div>
              </div>
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
          ) : shouldShowBrand ? (
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

            {/* Roofing Expert Button - Only shows for roof systems */}
            {isRoof && (
              <div className="pt-2">
                <Button 
                  onClick={handleRoofingExpertClick}
                  variant="green-dark"
                  className="w-full"
                >
                  Talk to a Local Roofing Expert
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
