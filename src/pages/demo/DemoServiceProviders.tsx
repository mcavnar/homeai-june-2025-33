
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CostSummaryCards from '@/components/ServiceProviders/CostSummaryCards';
import ActionCards from '@/components/ServiceProviders/ActionCards';
import ServiceProvidersTable from '@/components/ServiceProviders/ServiceProvidersTable';
import { Card, CardContent } from '@/components/ui/card';
import { TrackedButton } from '@/components/TrackedButton';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';

interface DemoServiceProvidersContextType {
  analysis: any;
}

const DemoServiceProviders = () => {
  const { analysis } = useOutletContext<DemoServiceProvidersContextType>();
  const {
    isModalOpen,
    openOptInModal,
    closeModal,
    confirmOptIn,
    currentService,
    getCurrentServiceConfig
  } = useServiceOptIn();

  // Demo cost summary
  const costSummary = {
    monthlyAverage: 950,
    annualTotal: 16800,
    marketDifference: 7200
  };

  // Demo service providers
  const serviceProviders = [
    {
      id: 1,
      serviceType: "Lawn Care",
      company: "",
      frequency: "Weekly",
      monthlyCost: 120,
      annualCost: 4680,
    },
    {
      id: 2,
      serviceType: "House Cleaning",
      company: "",
      frequency: "Bi-weekly",
      monthlyCost: 150,
      annualCost: 3900,
    },
    {
      id: 3,
      serviceType: "Plumbing",
      company: "",
      frequency: "As-needed",
      monthlyCost: 0,
      annualCost: 1800,
    },
    {
      id: 4,
      serviceType: "HVAC",
      company: "",
      frequency: "Quarterly",
      monthlyCost: 125,
      annualCost: 1500,
    },
    {
      id: 5,
      serviceType: "Electrical",
      company: "",
      frequency: "As-needed",
      monthlyCost: 0,
      annualCost: 1200,
    },
  ];

  const handleRecommendedProvidersClick = () => {
    openOptInModal('recommended_providers');
  };

  const config = getCurrentServiceConfig();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Providers</h1>
        <div className="text-gray-600 text-lg">
          <p>Estimated costs and recommended service providers for property maintenance</p>
        </div>
      </div>

      <CostSummaryCards costSummary={costSummary} />
      
      {/* See Our Recommended Providers Section */}
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            See Our Recommended Providers
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            We find the right providers for your area based on our database of millions of service provider transactions. Our algorithm analyzes quality ratings, pricing, availability, and local market conditions to match you with the most qualified professionals in your neighborhood.
          </p>
          <TrackedButton 
            variant="default" 
            size="lg" 
            className="px-8"
            onClick={handleRecommendedProvidersClick}
            trackingLabel="See Recommended Providers"
          >
            See Our Recommended Providers
          </TrackedButton>
        </CardContent>
      </Card>

      <ActionCards />
      <ServiceProvidersTable providers={serviceProviders} />

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
    </div>
  );
};

export default DemoServiceProviders;
