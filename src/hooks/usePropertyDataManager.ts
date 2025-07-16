
import { useEffect } from 'react';
import { usePropertyData } from './usePropertyData';

interface UsePropertyDataManagerProps {
  address?: string;
  propertyData?: any;
}

export const usePropertyDataManager = ({ address, propertyData }: UsePropertyDataManagerProps) => {
  const {
    propertyData: fetchedPropertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    setPropertyDataFromDatabase,
  } = usePropertyData();

  // Load property data from database if available
  useEffect(() => {
    if (propertyData) {
      console.log('Loading existing property data from database');
      setPropertyDataFromDatabase(propertyData);
    }
  }, [propertyData, setPropertyDataFromDatabase]);

  // Fetch property data immediately when address is available
  useEffect(() => {
    if (address && !propertyData && !fetchedPropertyData && !isLoadingProperty) {
      console.log('Starting property data fetch for address:', address);
      fetchPropertyDetails(address);
    }
  }, [address, propertyData, fetchedPropertyData, isLoadingProperty, fetchPropertyDetails]);

  return {
    propertyData: fetchedPropertyData || propertyData,
    isLoadingProperty,
    propertyError,
  };
};
