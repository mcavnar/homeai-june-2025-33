
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CostSummaryCards from '@/components/ServiceProviders/CostSummaryCards';
import ActionCards from '@/components/ServiceProviders/ActionCards';
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

  // Mock service providers data - these are placeholders without ratings
  const serviceProviders = [
    {
      id: 1,
      serviceType: "Lawn Care",
      company: "Average Lawn Care In Your Area",
      frequency: "Weekly",
      monthlyCost: 80,
      annualCost: 4160,
    },
    {
      id: 2,
      serviceType: "House Cleaning",
      company: "Typical House Cleaning Service",
      frequency: "Bi-weekly",
      monthlyCost: 125,
      annualCost: 3250,
    },
    {
      id: 3,
      serviceType: "Plumbing",
      company: "Local Plumbing Professional",
      frequency: "As-needed",
      monthlyCost: 0,
      annualCost: 1200,
    },
    {
      id: 4,
      serviceType: "HVAC",
      company: "Area HVAC Maintenance Service",
      frequency: "Quarterly",
      monthlyCost: 100,
      annualCost: 1200,
    },
    {
      id: 5,
      serviceType: "Electrical",
      company: "Regional Electrical Contractor",
      frequency: "As-needed",
      monthlyCost: 0,
      annualCost: 800,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Overview</h1>
        <p className="text-gray-600">Recommended service schedules and cost estimates for your property</p>
      </div>

      <CostSummaryCards costSummary={costSummary} />
      <ActionCards />
      <ServiceProvidersTable providers={serviceProviders} />
      <FindMoreProvidersCard />
    </div>
  );
};

export default ServiceProviders;
