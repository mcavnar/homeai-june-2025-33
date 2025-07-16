
import { useEffect, useState } from 'react';
import { usePropertyData } from './usePropertyData';

interface UsePropertyDataManagerProps {
  address?: string;
  propertyData?: any;
}

export const usePropertyDataManager = ({ address, propertyData }: UsePropertyDataManagerProps) => {
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false);
  
  const {
    propertyData: fetchedPropertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    setPropertyDataFromDatabase,
  } = usePropertyData();

  // Load property data from database if available
  useEffect(() => {
    if (propertyData && !hasLoadedFromDatabase) {
      console.log('Loading existing property data from database');
      setPropertyDataFromDatabase(propertyData);
      setHasLoadedFromDatabase(true);
    }
  }, [propertyData, hasLoadedFromDatabase, setPropertyDataFromDatabase]);

  // Only fetch property data if we don't have it from database and not already loading
  useEffect(() => {
    const shouldFetch = address && 
                       !propertyData && 
                       !fetchedPropertyData && 
                       !isLoadingProperty && 
                       !hasLoadedFromDatabase;
    
    if (shouldFetch) {
      console.log('Starting property data fetch for address:', address);
      fetchPropertyDetails(address);
    } else {
      console.log('Skipping property data fetch:', {
        hasAddress: !!address,
        hasPropertyData: !!propertyData,
        hasFetchedData: !!fetchedPropertyData,
        isLoading: isLoadingProperty,
        hasLoadedFromDB: hasLoadedFromDatabase
      });
    }
  }, [address, propertyData, fetchedPropertyData, isLoadingProperty, hasLoadedFromDatabase, fetchPropertyDetails]);

  return {
    propertyData: fetchedPropertyData || propertyData,
    isLoadingProperty,
    propertyError,
  };
};
