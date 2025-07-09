
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrackedButton } from '@/components/TrackedButton';
import { formatCurrency } from '@/utils/formatters';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';
import { ServiceType } from '@/hooks/useServiceOptIn';
import { Wrench, Hammer, Droplets, Zap } from 'lucide-react';

interface SystemCardProps {
  title: string;
  status: string;
  description: string;
  repairCost?: {
    min: number;
    max: number;
  };
  maintenanceTips?: string[];
  ctaText: string;
  ctaType: 'hvac' | 'roofing' | 'plumbing' | 'electrical';
  // Additional props for detailed information
  age?: string;
  yearsLeft?: string;
  brand?: string;
  type?: string;
  replacementCost?: {
    min: number;
    max: number;
  };
  maintenanceCosts?: {
    fiveYear: {
      min: number;
      max: number;
    };
    tenYear: {
      min: number;
      max: number;
    };
  };
  anticipatedRepairs?: {
    fiveYear: string[];
    tenYear: string[];
  };
}

const SystemCard: React.FC<SystemCardProps> = ({
  title,
  status,
  description,
  repairCost,
  maintenanceTips,
  ctaText,
  ctaType,
  age,
  yearsLeft,
  brand,
  type,
  replacementCost,
  maintenanceCosts,
  anticipatedRepairs
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDemoMode = location.pathname.includes('/demo/');

  const {
    isModalOpen,
    openOptInModal,
    closeModal,
    confirmOptIn,
    currentService,
    getCurrentServiceConfig
  } = useServiceOptIn();

  const getServiceType = (type: string): ServiceType => {
    switch (type) {
      case 'hvac':
        return 'hvac_technicians';
      case 'roofing':
        return 'roofing_experts';
      case 'plumbing':
        return 'plumbers';
      case 'electrical':
        return 'electricians';
      default:
        return 'recommended_providers';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hvac':
        return <Wrench className="h-4 w-4" />;
      case 'roofing':
        return <Hammer className="h-4 w-4" />;
      case 'plumbing':
        return <Droplets className="h-4 w-4" />;
      case 'electrical':
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleCTAClick = () => {
    if (isDemoMode) {
      navigate('/auth');
      return;
    }

    const serviceType = getServiceType(ctaType);
    openOptInModal(serviceType);
  };

  const config = getCurrentServiceConfig();

  // Check if we have detailed information to show
  const hasDetailedInfo = description || repairCost || maintenanceTips || maintenanceCosts || anticipatedRepairs;

  // Check if we have any system specifications to show
  const hasSystemSpecs = brand || type || age || yearsLeft || replacementCost;

  return (
    <>
      <Card className="border-gray-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              status === 'Good' ? 'bg-green-50 text-green-700 border-green-200' :
              status === 'Fair' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {status}
            </span>
          </div>
          
          {/* System Specifications */}
          {hasSystemSpecs && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">System Details</h4>
              <div className="space-y-3">
                {/* Brand - Full Width */}
                {brand && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand</span>
                    <span className="text-sm text-gray-900 font-medium">{brand}</span>
                  </div>
                )}
                
                {/* Type - Full Width */}
                {type && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                    <span className="text-sm text-gray-900 font-medium">{type}</span>
                  </div>
                )}
                
                {/* Age and Years Left - Two Columns */}
                {(age || yearsLeft) && (
                  <div className="grid grid-cols-2 gap-3">
                    {age && (
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</span>
                        <span className="text-sm text-gray-900 font-medium">{age}</span>
                      </div>
                    )}
                    
                    {yearsLeft && (
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Years Left</span>
                        <span className="text-sm text-gray-900 font-medium">{yearsLeft}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Replacement Cost - Full Width */}
                {replacementCost && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Replacement Cost</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {formatCurrency(replacementCost.min)} - {formatCurrency(replacementCost.max)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flexible spacer to push content to bottom */}
          <div className="flex-grow"></div>

          {/* Bottom Section - Accordion and CTA */}
          <div className="mt-auto space-y-4">
            {/* More Details Accordion */}
            {hasDetailedInfo && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-lg hover:no-underline transition-colors">
                    <span className="font-medium text-gray-900 text-sm">More Details</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 border-t border-gray-100 pt-4">
                      {/* Description */}
                      {description && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Overview</h5>
                          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                        </div>
                      )}

                      {/* Repair Costs */}
                      {repairCost && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Estimated Repair Costs</h5>
                          <p className="text-sm text-gray-900 font-medium">
                            {formatCurrency(repairCost.min)} - {formatCurrency(repairCost.max)}
                          </p>
                        </div>
                      )}

                      {/* Maintenance Tips */}
                      {maintenanceTips && maintenanceTips.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Maintenance Tips</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {maintenanceTips.map((tip, index) => (
                              <li key={index} className="text-sm leading-relaxed">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 5-Year Projections */}
                      {(maintenanceCosts?.fiveYear || anticipatedRepairs?.fiveYear) && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">5-Year Projections</h5>
                          {maintenanceCosts?.fiveYear && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Maintenance Costs: </span>
                              <span className="text-sm text-gray-900 font-medium">
                                {formatCurrency(maintenanceCosts.fiveYear.min)} - {formatCurrency(maintenanceCosts.fiveYear.max)}
                              </span>
                            </div>
                          )}
                          {anticipatedRepairs?.fiveYear && anticipatedRepairs.fiveYear.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Anticipated Repairs:</span>
                              <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                {anticipatedRepairs.fiveYear.map((repair, index) => (
                                  <li key={index} className="leading-relaxed">{repair}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 10-Year Projections */}
                      {(maintenanceCosts?.tenYear || anticipatedRepairs?.tenYear) && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">10-Year Projections</h5>
                          {maintenanceCosts?.tenYear && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Maintenance Costs: </span>
                              <span className="text-sm text-gray-900 font-medium">
                                {formatCurrency(maintenanceCosts.tenYear.min)} - {formatCurrency(maintenanceCosts.tenYear.max)}
                              </span>
                            </div>
                          )}
                          {anticipatedRepairs?.tenYear && anticipatedRepairs.tenYear.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Anticipated Repairs:</span>
                              <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                {anticipatedRepairs.tenYear.map((repair, index) => (
                                  <li key={index} className="leading-relaxed">{repair}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {/* CTA Button */}
            <TrackedButton 
              variant="green" 
              className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
              onClick={handleCTAClick}
              trackingLabel={ctaText}
            >
              <div className="flex items-center justify-center gap-2">
                {getServiceIcon(ctaType)}
                <span>{ctaText}</span>
              </div>
            </TrackedButton>
          </div>
        </CardContent>
      </Card>

      {config && currentService && !isDemoMode && (
        <ServiceOptInModal
          isOpen={isModalOpen}
          onClose={closeModal}
          serviceType={currentService}
          title={config.title}
          description={config.description}
          onConfirm={confirmOptIn}
        />
      )}
    </>
  );
};

export default SystemCard;
