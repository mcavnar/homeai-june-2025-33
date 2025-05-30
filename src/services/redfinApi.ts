const RAPIDAPI_KEY = '368fcd3424mshc9624dccf030eaep1ada4ajsn5c0135eebcf7';
const BASE_URL = 'https://redfin-com-data.p.rapidapi.com';

export interface RedfinPropertyData {
  soldDate: string | null;
  soldPrice: number | null;
  listedDate: string | null;
  listedPrice: number | null;
  bedrooms: number | null;
  squareFeet: number | null;
  regionCode: string | null;
  neighborhoodAvgDaysOnMarket: number | null;
  neighborhoodAvgSaleToListRatio: number | null;
  nearbyHomesAvgSquareFeet: number | null;
}

interface AutoCompleteResponse {
  didYouMean: Array<{
    rows: Array<{
      url: string;
    }>;
  }>;
}

interface PropertyDetailsResponse {
  avm: {
    lastSoldDate: number;
    lastSoldPrice: number;
    numBeds: number;
    sqFt: {
      value: number;
    };
  };
  belowTheFold: {
    propertyHistoryInfo: {
      events: Array<{
        mlsDescription: string;
        price: number;
        eventDate: number;
      }>;
    };
  };
  primaryRegionInfo: {
    regionType: number;
    tableId: number;
  };
  marketInsightsInfo?: {
    competeScoreInfo?: {
      aggs?: {
        dom?: number;
        saleToList?: number;
      };
    };
  };
  nearbyhomes?: {
    nearbyHomeDataList?: Array<{
      sqFt?: {
        value?: number;
      };
    }>;
  };
}

import { cleanAddressForSearch } from '@/utils/addressUtils';

export const searchPropertyByAddress = async (address: string): Promise<string | null> => {
  const cleanedAddress = cleanAddressForSearch(address);
  
  try {
    console.log('Searching for property with cleaned address:', cleanedAddress);
    
    const response = await fetch(`${BASE_URL}/properties/auto-complete?query=${encodeURIComponent(cleanedAddress)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Auto-complete API error: ${response.status}`);
    }

    const data: AutoCompleteResponse = await response.json();
    console.log('Auto-complete response:', JSON.stringify(data, null, 2));
    
    // Extract URL from didYouMean>0>rows>0>url
    if (data.didYouMean && data.didYouMean[0] && data.didYouMean[0].rows && data.didYouMean[0].rows[0]) {
      const url = data.didYouMean[0].rows[0].url;
      console.log('Found Redfin URL:', url);
      return url;
    }

    console.log('No property found for cleaned address, trying fallback...');
    
    // Try fallback with different state format
    const fallbackAddress = address.replace(/,\s*FL\s*$/i, ', Florida').replace(/\s+\d{5}(-\d{4})?$/, '');
    
    if (fallbackAddress !== cleanedAddress) {
      console.log('Trying fallback address:', fallbackAddress);
      
      const fallbackResponse = await fetch(`${BASE_URL}/properties/auto-complete?query=${encodeURIComponent(fallbackAddress)}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        }
      });

      if (fallbackResponse.ok) {
        const fallbackData: AutoCompleteResponse = await fallbackResponse.json();
        
        if (fallbackData.didYouMean && fallbackData.didYouMean[0] && fallbackData.didYouMean[0].rows && fallbackData.didYouMean[0].rows[0]) {
          const url = fallbackData.didYouMean[0].rows[0].url;
          console.log('Found Redfin URL with fallback:', url);
          return url;
        }
      }
    }

    console.log('No property found for address');
    return null;
  } catch (error) {
    console.error('Error searching property:', error);
    throw error;
  }
};

export const getPropertyDetails = async (redfinUrl: string): Promise<RedfinPropertyData> => {
  try {
    console.log('Fetching property details for URL:', redfinUrl);
    
    const response = await fetch(`${BASE_URL}/properties/details?url=${encodeURIComponent(redfinUrl)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Property details API error: ${response.status}`);
    }

    const response_data = await response.json();
    console.log('Full API Response:', JSON.stringify(response_data, null, 2));
    
    const data: PropertyDetailsResponse = response_data.data;
    console.log('Extracted data object:', JSON.stringify(data, null, 2));
    
    // Extract sold date and price
    const soldDate = data?.avm?.lastSoldDate 
      ? new Date(data.avm.lastSoldDate).toLocaleDateString()
      : null;
    const soldPrice = data?.avm?.lastSoldPrice || null;

    // Extract listed date and price from events array
    let listedDate: string | null = null;
    let listedPrice: number | null = null;
    
    if (data?.belowTheFold?.propertyHistoryInfo?.events) {
      const activeEvent = data.belowTheFold.propertyHistoryInfo.events.find(
        event => event.mlsDescription === 'Active'
      );
      
      if (activeEvent) {
        listedDate = new Date(activeEvent.eventDate).toLocaleDateString();
        listedPrice = activeEvent.price;
      }
    }

    // Extract bedrooms and square feet
    const bedrooms = data?.avm?.numBeds || null;
    const squareFeet = data?.avm?.sqFt?.value || null;

    // Extract region code (regionType_tableId)
    const regionCode = data?.primaryRegionInfo 
      ? `${data.primaryRegionInfo.regionType}_${data.primaryRegionInfo.tableId}`
      : null;

    // Extract neighborhood market insights with corrected path
    console.log('Market insights info:', JSON.stringify(data?.marketInsightsInfo, null, 2));
    const neighborhoodAvgDaysOnMarket = data?.marketInsightsInfo?.competeScoreInfo?.aggs?.dom || null;
    const neighborhoodAvgSaleToListRatio = data?.marketInsightsInfo?.competeScoreInfo?.aggs?.saleToList || null;
    
    console.log('Extracted neighborhood avg days on market:', neighborhoodAvgDaysOnMarket);
    console.log('Extracted neighborhood avg sale-to-list ratio:', neighborhoodAvgSaleToListRatio);

    // Calculate nearby homes average square feet with corrected path
    let nearbyHomesAvgSquareFeet: number | null = null;
    console.log('Nearby homes data:', JSON.stringify(data?.nearbyhomes?.nearbyHomeDataList, null, 2));
    
    if (data?.nearbyhomes?.nearbyHomeDataList) {
      const squareFeetValues = data.nearbyhomes.nearbyHomeDataList
        .map(home => home.sqFt?.value)
        .filter((value): value is number => value !== undefined && value !== null);
      
      console.log('Square feet values from nearby homes:', squareFeetValues);
      
      if (squareFeetValues.length > 0) {
        nearbyHomesAvgSquareFeet = Math.round(
          squareFeetValues.reduce((sum, value) => sum + value, 0) / squareFeetValues.length
        );
      }
    }

    const propertyData: RedfinPropertyData = {
      soldDate,
      soldPrice,
      listedDate,
      listedPrice,
      bedrooms,
      squareFeet,
      regionCode,
      neighborhoodAvgDaysOnMarket,
      neighborhoodAvgSaleToListRatio,
      nearbyHomesAvgSquareFeet
    };

    console.log('Final extracted property data:', propertyData);
    return propertyData;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};

export const fetchPropertyData = async (address: string): Promise<RedfinPropertyData> => {
  const redfinUrl = await searchPropertyByAddress(address);
  
  if (!redfinUrl) {
    throw new Error('Property not found for the given address');
  }

  return await getPropertyDetails(redfinUrl);
};
