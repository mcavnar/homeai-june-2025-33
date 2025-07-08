
import React from 'react';
import { useSharedReport } from '@/contexts/SharedReportContext';
import ServiceProvidersTable from '@/components/ServiceProviders/ServiceProvidersTable';
import CostSummaryCards from '@/components/ServiceProviders/CostSummaryCards';

const SharedServiceProviders = () => {
  const { analysis, propertyData } = useSharedReport();

  // Create cost summary from analysis data
  const costSummary = {
    monthlyAverage: analysis?.costSummary?.monthlyAverage || 0,
    annualTotal: analysis?.costSummary?.annualTotal || 0,
    marketDifference: analysis?.costSummary?.marketDifference || 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Providers</h1>
        <div className="text-gray-600 text-lg">
          <p>Recommended professionals for addressing inspection findings</p>
        </div>
      </div>

      <CostSummaryCards costSummary={costSummary} />
      
      <ServiceProvidersTable 
        issues={analysis?.issues || []} 
        propertyData={propertyData}
        showRequestButtons={false}
      />
    </div>
  );
};

export default SharedServiceProviders;
