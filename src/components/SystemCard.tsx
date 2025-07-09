
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrackedButton } from '@/components/TrackedButton';
import { formatCurrency } from '@/utils/formatters';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';
import { ServiceType } from '@/hooks/useServiceOptIn';

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

  return (
    <>
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'Good' ? 'bg-green-100 text-green-800' :
              status === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status}
            </span>
          </div>
          
          {/* System Specifications in Main Card */}
          <div className="space-y-3 mb-4">
            {brand && (
              <div>
                <span className="font-medium text-gray-900">Brand: </span>
                <span className="text-gray-600">{brand}</span>
              </div>
            )}
            
            {type && (
              <div>
                <span className="font-medium text-gray-900">Type: </span>
                <span className="text-gray-600">{type}</span>
              </div>
            )}
            
            {age && (
              <div>
                <span className="font-medium text-gray-900">Age: </span>
                <span className="text-gray-600">{age}</span>
              </div>
            )}
            
            {yearsLeft && (
              <div>
                <span className="font-medium text-gray-900">Years Left: </span>
                <span className="text-gray-600">{yearsLeft}</span>
              </div>
            )}
            
            {replacementCost && (
              <div>
                <span className="font-medium text-gray-900">Replacement Cost: </span>
                <span className="text-gray-600">
                  {formatCurrency(replacementCost.min)} - {formatCurrency(replacementCost.max)}
                </span>
              </div>
            )}
          </div>

          {hasDetailedInfo && (
            <div className="mb-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium text-gray-900">More Details</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      {/* Description */}
                      {description && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Overview</h5>
                          <p className="text-gray-600 text-sm">{description}</p>
                        </div>
                      )}

                      {/* Repair Costs */}
                      {repairCost && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Estimated Repair Costs</h5>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(repairCost.min)} - {formatCurrency(repairCost.max)}
                          </p>
                        </div>
                      )}

                      {/* Maintenance Tips */}
                      {maintenanceTips && maintenanceTips.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Maintenance Tips</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {maintenanceTips.map((tip, index) => (
                              <li key={index} className="text-sm">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 5-Year Projections */}
                      {(maintenanceCosts?.fiveYear || anticipatedRepairs?.fiveYear) && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">5-Year Projections</h5>
                          {maintenanceCosts?.fiveYear && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Maintenance Costs: </span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(maintenanceCosts.fiveYear.min)} - {formatCurrency(maintenanceCosts.fiveYear.max)}
                              </span>
                            </div>
                          )}
                          {anticipatedRepairs?.fiveYear && anticipatedRepairs.fiveYear.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Anticipated Repairs:</span>
                              <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                {anticipatedRepairs.fiveYear.map((repair, index) => (
                                  <li key={index}>{repair}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 10-Year Projections */}
                      {(maintenanceCosts?.tenYear || anticipatedRepairs?.tenYear) && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">10-Year Projections</h5>
                          {maintenanceCosts?.tenYear && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Maintenance Costs: </span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(maintenanceCosts.tenYear.min)} - {formatCurrency(maintenanceCosts.tenYear.max)}
                              </span>
                            </div>
                          )}
                          {anticipatedRepairs?.tenYear && anticipatedRepairs.tenYear.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Anticipated Repairs:</span>
                              <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                {anticipatedRepairs.tenYear.map((repair, index) => (
                                  <li key={index}>{repair}</li>
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
            </div>
          )}
          
          <TrackedButton 
            variant="green" 
            className="w-full"
            onClick={handleCTAClick}
            trackingLabel={ctaText}
          >
            {ctaText}
          </TrackedButton>
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
