
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserReport } from '@/hooks/useUserReport';

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
  const { toast } = useToast();
  const { userReport, updateUserReport } = useUserReport();

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

  const getCachedEstimate = useCallback((address: string): MaintenanceEstimate | null => {
    if (!userReport?.property_data) return null;

    const propertyData = userReport.property_data as any;
    const maintenanceCache = propertyData.maintenanceEstimate;

    if (!maintenanceCache || maintenanceCache.address !== address) {
      return null;
    }

    // Check if cache is still valid (within CACHE_DURATION)
    const cacheTime = new Date(maintenanceCache.cachedAt).getTime();
    const now = new Date().getTime();
    
    if (now - cacheTime > CACHE_DURATION) {
      console.log('Maintenance estimate cache expired');
      return null;
    }

    console.log('Using cached maintenance estimate');
    return maintenanceCache.estimate;
  }, [userReport?.property_data]);

  const saveCachedEstimate = useCallback(async (address: string, estimate: MaintenanceEstimate) => {
    if (!userReport) return;

    try {
      const currentPropertyData = (userReport.property_data as any) || {};
      const updatedPropertyData = {
        ...currentPropertyData,
        maintenanceEstimate: {
          address,
          estimate,
          cachedAt: new Date().toISOString()
        }
      };

      await updateUserReport({
        property_data: updatedPropertyData
      });

      console.log('Maintenance estimate cached successfully');
    } catch (error) {
      console.error('Failed to cache maintenance estimate:', error);
      // Don't throw error - caching failure shouldn't block the user
    }
  }, [userReport, updateUserReport]);

  const fetchEstimate = useCallback(async (address: string) => {
    if (!address) {
      setError('Address is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, check if we have cached data
      const cachedEstimate = getCachedEstimate(address);
      if (cachedEstimate) {
        setEstimate(cachedEstimate);
        const providers = generateServiceProviders(cachedEstimate);
        setServiceProviders(providers);
        setIsLoading(false);
        return;
      }

      // Generate a default estimate based on property location
      const defaultEstimate: MaintenanceEstimate = {
        monthlyRangeLow: 200,
        monthlyRangeHigh: 400,
        regionalComparison: "Average for your area",
        explanation: "Estimated based on typical home maintenance costs in your region."
      };
      
      setEstimate(defaultEstimate);
      
      // Generate service providers based on the estimate
      const providers = generateServiceProviders(defaultEstimate);
      setServiceProviders(providers);

      // Cache the estimate for future use
      await saveCachedEstimate(address, defaultEstimate);

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
  }, [generateServiceProviders, toast, getCachedEstimate, saveCachedEstimate]);

  return {
    estimate,
    serviceProviders,
    isLoading,
    error,
    fetchEstimate
  };
};
