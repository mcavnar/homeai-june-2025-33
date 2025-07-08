
import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import CostSummaryCards from '@/components/ServiceProviders/CostSummaryCards';
import ActionCards from '@/components/ServiceProviders/ActionCards';
import ServiceProvidersTable from '@/components/ServiceProviders/ServiceProvidersTable';
import { useMaintenanceEstimate } from '@/hooks/useMaintenanceEstimate';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { TrackedButton } from '@/components/TrackedButton';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';

interface ServiceProvidersContextType {
  analysis: any;
  propertyData: any;
}

const ServiceProviders = () => {
  const { analysis, propertyData } = useOutletContext<ServiceProvidersContextType>();
  const { estimate, serviceProviders, isLoading, error, fetchEstimate } = useMaintenanceEstimate();
  const {
    isModalOpen,
    openOptInModal,
    closeModal,
    confirmOptIn,
    currentService,
    getCurrentServiceConfig
  } = useServiceOptIn();

  // Extract address from property data
  const propertyAddress = propertyData?.address || propertyData?.streetAddress || analysis?.propertyInfo?.address;

  useEffect(() => {
    if (propertyAddress) {
      console.log('Fetching maintenance estimate for address:', propertyAddress);
      fetchEstimate(propertyAddress);
    }
  }, [propertyAddress, fetchEstimate]);

  // Calculate cost summary based on estimate and service providers
  const calculateCostSummary = () => {
    if (estimate && serviceProviders.length > 0) {
      const monthlyAverage = Math.round((estimate.monthlyRangeLow + estimate.monthlyRangeHigh) / 2);
      const annualTotal = serviceProviders.reduce((sum, provider) => sum + provider.annualCost, 0);
      
      // Extract percentage from regionalComparison (e.g., "+15%" -> 15)
      const percentageMatch = estimate.regionalComparison.match(/([+-]?\d+)%/);
      const comparisonPercentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;
      const marketDifference = Math.round(annualTotal * (Math.abs(comparisonPercentage) / 100));

      return { monthlyAverage, annualTotal, marketDifference };
    }

    // Fallback calculation if estimate is not available
    if (!analysis?.issues) {
      return {
        monthlyAverage: 820,
        annualTotal: 14790,
        marketDifference: 6170
      };
    }

    const totalCosts = analysis.issues.reduce((sum: number, issue: any) => {
      return sum + ((issue.estimatedCost?.min || 0) + (issue.estimatedCost?.max || 0)) / 2;
    }, 0);

    const monthlyAverage = Math.round(totalCosts * 0.05);
    const annualTotal = Math.round(totalCosts * 0.6);
    const marketDifference = Math.round(annualTotal * 0.42);

    return { monthlyAverage, annualTotal, marketDifference };
  };

  const costSummary = calculateCostSummary();

  const handleRecommendedProvidersClick = () => {
    openOptInModal('recommended_providers');
  };

  const config = getCurrentServiceConfig();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Providers</h1>
          <div className="text-gray-600 text-lg">
            <p>Loading location-specific maintenance costs...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Providers</h1>
        <div className="text-gray-600 text-lg">
          {estimate ? (
            <div>
              <p>Location-specific maintenance costs for {propertyAddress}</p>
              <p className="text-sm mt-1 text-gray-500">{estimate.explanation}</p>
            </div>
          ) : (
            <p>Estimated costs and recommended service providers for property maintenance</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Using default estimates. Location-specific data unavailable: {error}
          </p>
        </div>
      )}

      <CostSummaryCards costSummary={costSummary} estimate={estimate} />
      
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

      <ServiceProvidersTable providers={serviceProviders} />
      <ActionCards />

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

export default ServiceProviders;
