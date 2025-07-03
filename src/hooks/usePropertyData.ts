
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

    // Check if userReport exists before proceeding
    if (!userReport) {
      console.log('UserReport not yet loaded, waiting...');
      // Set a short timeout to retry when userReport becomes available
      setTimeout(() => {
        if (userReport) {
          console.log('UserReport now available, retrying property fetch');
          fetchPropertyDetails(address);
        }
      }, 1000);
      return;
    }

    setIsLoadingProperty(true);
    setPropertyError('');

    try {
      console.log('Fetching property details for address:', address);
      
      toast({
        title: "Fetching property details...",
        description: "Looking up market information for this property.",
      });

      const data = await fetchPropertyData(address);
      setPropertyData(data);
      setLastFetchedAddress(address);

      // Save property data to user_reports table with retry logic
      console.log('Saving property data to user_reports table');
      try {
        await updateUserReport({ property_data: data });
        console.log('Property data saved successfully to database');
      } catch (updateError) {
        console.error('Failed to save property data to database:', updateError);
        // Don't fail the entire operation if database save fails
        // The user still gets the property data in the UI
        toast({
          title: "Property data loaded",
          description: "Market information loaded, but there was an issue saving to database.",
          variant: "destructive"
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
