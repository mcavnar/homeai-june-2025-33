
import { supabase } from '@/integrations/supabase/client';
import { getCachedPropertyData, setCachedPropertyData } from './propertyDataCache';

export const fetchPropertyData = async (address: string) => {
  try {
    console.log('🏠 Fetching property data via Supabase for address:', address);
    
    // Check cache first
    const cachedData = getCachedPropertyData(address);
    if (cachedData) {
      console.log('🏠 Using cached property data');
      return cachedData;
    }
    
    console.log('🏠 Calling get-property-data edge function...');
    const { data, error } = await supabase.functions.invoke('get-property-data', {
      body: { address }
    });

    if (error) {
      console.error('🏠 Property data fetch error:', error);
      return null;
    }

    console.log('🏠 Raw Supabase response:', data);

    if (data && data.success) {
      console.log('🏠 Property data fetched successfully:', data.propertyData);
      
      // Cache the result
      setCachedPropertyData(address, data.propertyData);
      
      return data.propertyData;
    } else {
      console.log('🏠 No property data found or fetch failed:', data);
      return null;
    }
  } catch (err) {
    console.error('🏠 Error fetching property data:', err);
    return null;
  }
};
