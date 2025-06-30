
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CostSummaryCards from '@/components/ServiceProviders/CostSummaryCards';
import ServiceProvidersTable from '@/components/ServiceProviders/ServiceProvidersTable';
import FindMoreProvidersCard from '@/components/ServiceProviders/FindMoreProvidersCard';

interface ServiceProvidersContextType {
  analysis: any;
  propertyData: any;
}

const ServiceProviders = () => {
  const { analysis, propertyData } = useOutletContext<ServiceProvidersContextType>();

  // Calculate estimated costs based on analysis data
  const calculateCostSummary = () => {
    if (!analysis?.issues) {
      return {
        monthlyAverage: 820,
        annualTotal: 14790,
        marketDifference: 6170
      };
    }

    // Calculate total estimated costs from analysis
    const totalCosts = analysis.issues.reduce((sum: number, issue: any) => {
      return sum + ((issue.estimatedCost?.min || 0) + (issue.estimatedCost?.max || 0)) / 2;
    }, 0);

    // Estimate monthly and annual costs based on repair urgency
    const monthlyAverage = Math.round(totalCosts * 0.05); // 5% of total per month for maintenance
    const annualTotal = Math.round(totalCosts * 0.6); // 60% of issues addressed annually
    const marketDifference = Math.round(annualTotal * 0.42); // 42% above market average

    return { monthlyAverage, annualTotal, marketDifference };
  };

  const costSummary = calculateCostSummary();

  // Mock service providers data organized by service type
  const getServiceProviders = (address?: string) => {
    const serviceProviders = [
      {
        id: 1,
        serviceType: "Lawn Care",
        company: "PerfectLawn Care",
        frequency: "Weekly",
        monthlyCost: 320,
        annualCost: 3840,
        rating: 4.8,
        reviews: 245,
        phone: "(555) 123-4567",
        distance: "2.3 miles",
      },
      {
        id: 2,
        serviceType: "House Cleaning",
        company: "Spotless Home Cleaning",
        frequency: "Bi-weekly",
        monthlyCost: 250,
        annualCost: 3000,
        rating: 4.9,
        reviews: 189,
        phone: "(555) 234-5678",
        distance: "1.8 miles",
      },
      {
        id: 3,
        serviceType: "Plumbing",
        company: "AquaFlow Plumbing",
        frequency: "As-needed",
        monthlyCost: 0,
        annualCost: 1200,
        rating: 4.7,
        reviews: 156,
        phone: "(555) 345-6789",
        distance: "3.1 miles",
      },
      {
        id: 4,
        serviceType: "HVAC",
        company: "Climate Control Experts",
        frequency: "Quarterly",
        monthlyCost: 100,
        annualCost: 1200,
        rating: 4.6,
        reviews: 198,
        phone: "(555) 456-7890",
        distance: "2.7 miles",
      },
      {
        id: 5,
        serviceType: "Electrical",
        company: "Elite Electrical Solutions",
        frequency: "As-needed",
        monthlyCost: 0,
        annualCost: 800,
        rating: 4.9,
        reviews: 167,
        phone: "(555) 567-8901",
        distance: "2.1 miles",
      },
    ];

    return serviceProviders;
  };

  const providers = getServiceProviders(analysis?.propertyInfo?.address);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Overview</h1>
        <p className="text-gray-600">Recommended service schedules and cost estimates for your property</p>
      </div>

      <CostSummaryCards costSummary={costSummary} />
      <ServiceProvidersTable providers={providers} />
      <FindMoreProvidersCard />
    </div>
  );
};

export default ServiceProviders;
