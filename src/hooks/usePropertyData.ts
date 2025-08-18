
import { useState, useCallback } from 'react';
import { fetchPropertyData } from '@/services/redfinApi';
import { RedfinPropertyData } from '@/types/redfin';
import { useToast } from '@/hooks/use-toast';
import { useUserReport } from '@/hooks/useUserReport';

export const usePropertyData = () => {
  const [propertyData, setPropertyData] = useState<RedfinPropertyData | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState<string>('');
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string>('');
  const { toast } = useToast();
  const { userReport, updateUserReport } = useUserReport();

  const fetchPropertyDetails = useCallback(async (address: string) => {
    // Prevent duplicate API calls for the same address
    if (address === lastFetchedAddress && propertyData) {
      console.log('Property data already fetched for this address, skipping API call');
      return;
    }

    setIsLoadingProperty(true);
    setPropertyError('');

    try {
      console.log('🏠 Fetching property details for address:', address);
      
      toast({
        title: "Fetching property details...",
        description: "Looking up market information for this property.",
      });

      const data = await fetchPropertyData(address);
      console.log('🏠 Property data received:', data);
      
      if (!data) {
        console.warn('🏠 Property data is null, check API response');
        throw new Error('No property data returned from API');
      }
      
      setPropertyData(data);
      setLastFetchedAddress(address);

      // Save property data to user_reports table in background (non-blocking)
      if (userReport) {
        console.log('Saving property data to user_reports table');
        // Don't await this - let it run in background
        updateUserReport({ property_data: data }).catch(updateError => {
          console.error('Failed to save property data to database:', updateError);
          // Don't show error toast for background saves
        });
      }

      toast({
        title: "Property details loaded!",
        description: "Market information and property stats have been added.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property details';
      setPropertyError(errorMessage);
      console.error('Property fetch error:', err);
      toast({
        title: "Property fetch failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingProperty(false);
    }
  }, [lastFetchedAddress, propertyData, userReport, toast, updateUserReport]);

  const resetPropertyData = () => {
    setPropertyData(null);
    setPropertyError('');
    setLastFetchedAddress('');
  };

  const setPropertyDataFromDatabase = (data: RedfinPropertyData | null) => {
    setPropertyData(data);
    if (data) {
      console.log('Property data loaded from database');
    }
  };

  return {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    resetPropertyData,
    setPropertyDataFromDatabase,
  };
};
