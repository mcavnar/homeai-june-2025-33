
import { useState, useCallback } from 'react';
import { fetchPropertyData } from '@/services/redfinApi';
import { RedfinPropertyData } from '@/types/redfin';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAnonymousPropertyData = (sessionId?: string) => {
  const [propertyData, setPropertyData] = useState<RedfinPropertyData | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState<string>('');
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string>('');
  const { toast } = useToast();

  const fetchPropertyDetails = useCallback(async (address: string) => {
    // Prevent duplicate API calls for the same address
    if (address === lastFetchedAddress && propertyData) {
      console.log('Property data already fetched for this address, skipping API call');
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

      // Save property data to anonymous_reports table in background (non-blocking)
      if (sessionId) {
        console.log('Saving property data to anonymous_reports table');
        // Don't await this - let it run in background
        supabase.from('anonymous_reports')
          .update({ property_data: data as any })
          .eq('session_id', sessionId)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to save property data to database:', error);
            }
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
  }, [lastFetchedAddress, propertyData, sessionId, toast]);

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
