
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CostSummaryCards from '@/components/ServiceProviders/CostSummaryCards';

import ServiceProvidersTable from '@/components/ServiceProviders/ServiceProvidersTable';
import { Card, CardContent } from '@/components/ui/card';

interface DemoServiceProvidersContextType {
  analysis: any;
}

const DemoServiceProviders = () => {
  const { analysis } = useOutletContext<DemoServiceProvidersContextType>();
  const navigate = useNavigate();

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

  const handleUploadReport = () => {
    navigate('/anonymous-upload');
  };

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
      
      <ServiceProvidersTable 
        providers={serviceProviders} 
        propertyAddress={analysis?.propertyInfo?.address} 
      />
    </div>
  );
};

export default DemoServiceProviders;
