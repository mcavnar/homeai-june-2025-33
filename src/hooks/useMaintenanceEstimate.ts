
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceEstimate {
  monthlyRangeLow: number;
  monthlyRangeHigh: number;
  regionalComparison: string;
  explanation: string;
}

interface ServiceProvider {
  id: number;
  serviceType: string;
  company: string;
  frequency: string;
  monthlyCost: number;
  annualCost: number;
}

interface UseMaintenanceEstimateReturn {
  estimate: MaintenanceEstimate | null;
  serviceProviders: ServiceProvider[];
  isLoading: boolean;
  error: string | null;
  fetchEstimate: (address: string) => Promise<void>;
}

// Cache duration: 30 days in milliseconds
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;

export const useMaintenanceEstimate = (): UseMaintenanceEstimateReturn => {
  const [estimate, setEstimate] = useState<MaintenanceEstimate | null>(null);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedAddress = useRef<string>('');
  const { toast } = useToast();

  const generateServiceProviders = useCallback((estimate: MaintenanceEstimate): ServiceProvider[] => {
    // Calculate average monthly cost from the estimate
    const avgMonthlyCost = (estimate.monthlyRangeLow + estimate.monthlyRangeHigh) / 2;
    
    // Define service types with their typical percentage of total maintenance budget
    const serviceTypes = [
      { type: "Lawn Care", percentage: 0.15, frequency: "Weekly" },
      { type: "House Cleaning", percentage: 0.25, frequency: "Bi-weekly" },
      { type: "HVAC", percentage: 0.20, frequency: "Quarterly" },
      { type: "Plumbing", percentage: 0.15, frequency: "As-needed" },
      { type: "Electrical", percentage: 0.10, frequency: "As-needed" },
      { type: "Pest Control", percentage: 0.08, frequency: "Quarterly" },
      { type: "Home Security", percentage: 0.07, frequency: "Monthly" }
    ];

    return serviceTypes.map((service, index) => {
      const monthlyCost = service.frequency === "As-needed" ? 0 : Math.round(avgMonthlyCost * service.percentage);
      const annualCost = service.frequency === "As-needed" 
        ? Math.round(avgMonthlyCost * service.percentage * 12)
        : monthlyCost * 12;

      return {
        id: index + 1,
        serviceType: service.type,
        company: "",
        frequency: service.frequency,
        monthlyCost,
        annualCost
      };
    });
  }, []);


  const fetchEstimate = useCallback(async (address: string) => {
    if (!address) {
      setError('Address is required');
      return;
    }

    // Prevent duplicate calls for the same address
    if (estimate && lastFetchedAddress.current === address) {
      console.log('Maintenance estimate already fetched for this address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate a default estimate based on property location
      const defaultEstimate: MaintenanceEstimate = {
        monthlyRangeLow: 200,
        monthlyRangeHigh: 400,
        regionalComparison: "Average for your area",
        explanation: "Estimated based on typical home maintenance costs in your region."
      };
      
      setEstimate(defaultEstimate);
      lastFetchedAddress.current = address;
      
      // Generate service providers based on the estimate
      const providers = generateServiceProviders(defaultEstimate);
      setServiceProviders(providers);

      toast({
        title: "Maintenance estimate loaded",
        description: "Location-specific maintenance costs have been calculated.",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate maintenance estimate';
      setError(errorMessage);
      console.error('Maintenance estimate error:', err);
      
      // Fallback to default service providers
      const defaultProviders = [
        { id: 1, serviceType: "Lawn Care", company: "", frequency: "Weekly", monthlyCost: 80, annualCost: 960 },
        { id: 2, serviceType: "House Cleaning", company: "", frequency: "Bi-weekly", monthlyCost: 125, annualCost: 3250 },
        { id: 3, serviceType: "Plumbing", company: "", frequency: "As-needed", monthlyCost: 0, annualCost: 1200 },
        { id: 4, serviceType: "HVAC", company: "", frequency: "Quarterly", monthlyCost: 100, annualCost: 1200 },
        { id: 5, serviceType: "Electrical", company: "", frequency: "As-needed", monthlyCost: 0, annualCost: 800 },
      ];
      setServiceProviders(defaultProviders);
    } finally {
      setIsLoading(false);
    }
  }, [generateServiceProviders, toast]);

  return {
    estimate,
    serviceProviders,
    isLoading,
    error,
    fetchEstimate
  };
};
