
import { useState } from 'react';
import { fetchPropertyData } from '@/services/redfinApi';
import { RedfinPropertyData } from '@/types/redfin';
import { useToast } from '@/hooks/use-toast';

export const usePropertyData = () => {
  const [propertyData, setPropertyData] = useState<RedfinPropertyData | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState<string>('');
  const { toast } = useToast();

  const fetchPropertyDetails = async (address: string) => {
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

      toast({
        title: "Property details loaded!",
        description: "Market information and property stats have been added.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property details';
      setPropertyError(errorMessage);
      console.error('Property fetch error:', err);
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const resetPropertyData = () => {
    setPropertyData(null);
    setPropertyError('');
  };

  return {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    resetPropertyData,
  };
};
