
import { searchPropertyByAddress } from './propertySearchService';
import { getPropertyDetails } from './propertyDetailsService';
import { RedfinPropertyData } from '@/types/redfin';

export { RedfinPropertyData } from '@/types/redfin';

export { searchPropertyByAddress, getPropertyDetails };

export const fetchPropertyData = async (address: string): Promise<RedfinPropertyData> => {
  const redfinUrl = await searchPropertyByAddress(address);
  
  if (!redfinUrl) {
    throw new Error('Property not found for the given address');
  }

  return await getPropertyDetails(redfinUrl);
};
