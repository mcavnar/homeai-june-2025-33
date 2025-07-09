
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';
import { ServiceType } from '@/hooks/useServiceOptIn';
import SystemHeader from './SystemCard/SystemHeader';
import SystemSpecs from './SystemCard/SystemSpecs';
import SystemDetails from './SystemCard/SystemDetails';
import SystemCTA from './SystemCard/SystemCTA';

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
      <Card className="border-gray-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6 flex flex-col h-full">
          <SystemHeader title={title} status={status} />
          
          <SystemSpecs
            type={type}
            age={age}
            yearsLeft={yearsLeft}
            replacementCost={replacementCost}
          />

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
                    <SystemDetails
                      description={description}
                      repairCost={repairCost}
                      maintenanceTips={maintenanceTips}
                      maintenanceCosts={maintenanceCosts}
                      anticipatedRepairs={anticipatedRepairs}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {/* CTA Button */}
            <SystemCTA
              ctaText={ctaText}
              ctaType={ctaType}
              onClick={handleCTAClick}
            />
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
