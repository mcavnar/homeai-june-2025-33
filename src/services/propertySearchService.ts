
import { cleanAddressForSearch } from '@/utils/addressUtils';
import { createApiRequest } from './redfinApiClient';
import { AutoCompleteResponse } from '@/types/redfin';

const extractUrlFromResponse = (data: AutoCompleteResponse): string | null => {
  if (!data.status) {
    console.log('API returned unsuccessful status:', data.message);
    return null;
  }
  
  // Handle new API response format with didYouMean
  if (Array.isArray(data.data)) {
    // Old format: data is an array
    if (data.data?.[0]?.rows?.[0]?.url) {
      return data.data[0].rows[0].url;
    }
  } else {
    // New format: data is an object with didYouMean property
    if (data.data?.didYouMean?.[0]?.rows?.[0]?.url) {
      return data.data.didYouMean[0].rows[0].url;
    }
  }
  
  return null;
};

const searchWithAddress = async (address: string): Promise<string | null> => {
  console.log('Searching for property with address:', address);
  
  const response = await createApiRequest(`/properties/auto-complete?query=${encodeURIComponent(address)}`);
  
  if (!response.ok) {
    throw new Error(`Auto-complete API error: ${response.status}`);
  }

  const data: AutoCompleteResponse = await response.json();
  console.log('Auto-complete response:', JSON.stringify(data, null, 2));
  
  return extractUrlFromResponse(data);
};

export const searchPropertyByAddress = async (address: string): Promise<string | null> => {
  try {
    const cleanedAddress = cleanAddressForSearch(address);
    
    // Try with cleaned address first
    let url = await searchWithAddress(cleanedAddress);
    if (url) {
      console.log('Found Redfin URL:', url);
      return url;
    }

    console.log('No property found for cleaned address, trying fallback...');
    
    // Try fallback with different state format
    const fallbackAddress = address.replace(/,\s*FL\s*$/i, ', Florida').replace(/\s+\d{5}(-\d{4})?$/, '');
    
    if (fallbackAddress !== cleanedAddress) {
      console.log('Trying fallback address:', fallbackAddress);
      
      url = await searchWithAddress(fallbackAddress);
      if (url) {
        console.log('Found Redfin URL with fallback:', url);
        return url;
      }
    }

    console.log('No property found for address');
    return null;
  } catch (error) {
    console.error('Error searching property:', error);
    throw error;
  }
};
