
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useMaintenanceEstimate = (): UseMaintenanceEstimateReturn => {
  const [estimate, setEstimate] = useState<MaintenanceEstimate | null>(null);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching maintenance estimate for:', address);
      
      const { data, error: functionError } = await supabase.functions.invoke('get-maintenance-estimate', {
        body: { address }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch maintenance estimate');
      }

      if (!data) {
        throw new Error('No data received from maintenance estimate service');
      }

      console.log('Maintenance estimate received:', data);
      
      setEstimate(data);
      
      // Generate service providers based on the estimate
      const providers = generateServiceProviders(data);
      setServiceProviders(providers);

      toast({
        title: "Maintenance estimate loaded",
        description: "Location-specific maintenance costs have been calculated.",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch maintenance estimate';
      setError(errorMessage);
      console.error('Maintenance estimate error:', err);
      
      // Fallback to default service providers
      const defaultProviders = [
        { id: 1, serviceType: "Lawn Care", company: "", frequency: "Weekly", monthlyCost: 80, annualCost: 4160 },
        { id: 2, serviceType: "House Cleaning", company: "", frequency: "Bi-weekly", monthlyCost: 125, annualCost: 3250 },
        { id: 3, serviceType: "Plumbing", company: "", frequency: "As-needed", monthlyCost: 0, annualCost: 1200 },
        { id: 4, serviceType: "HVAC", company: "", frequency: "Quarterly", monthlyCost: 100, annualCost: 1200 },
        { id: 5, serviceType: "Electrical", company: "", frequency: "As-needed", monthlyCost: 0, annualCost: 800 },
      ];
      setServiceProviders(defaultProviders);
      
      toast({
        title: "Using default estimates",
        description: "Could not fetch location-specific data. Using standard estimates.",
        variant: "destructive"
      });
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
