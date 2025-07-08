
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrackedButton } from '@/components/TrackedButton';
import { formatCurrency } from '@/utils/formatters';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';
import { ServiceType } from '@/hooks/useServiceOptIn';

interface SystemCardProps {
  title: string;
  status: string;
  description: string;
  repairCost: {
    min: number;
    max: number;
  };
  maintenanceTips: string[];
  ctaText: string;
  ctaType: 'hvac' | 'roofing' | 'plumbing' | 'electrical';
}

const SystemCard: React.FC<SystemCardProps> = ({
  title,
  status,
  description,
  repairCost,
  maintenanceTips,
  ctaText,
  ctaType
}) => {
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
    const serviceType = getServiceType(ctaType);
    openOptInModal(serviceType);
  };

  const config = getCurrentServiceConfig();

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
          
          <p className="text-gray-600 mb-4">{description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Estimated Repair Costs</h4>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(repairCost.min)} - {formatCurrency(repairCost.max)}
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Maintenance Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {maintenanceTips.map((tip, index) => (
                <li key={index} className="text-sm">{tip}</li>
              ))}
            </ul>
          </div>
          
          <TrackedButton 
            variant="default" 
            className="w-full"
            onClick={handleCTAClick}
            trackingLabel={ctaText}
          >
            {ctaText}
          </TrackedButton>
        </CardContent>
      </Card>

      {config && currentService && (
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
