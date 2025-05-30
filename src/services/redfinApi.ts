
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
}

interface AutoCompleteResponse {
  data: Array<{
    rows: Array<{
      url: string;
    }>;
  }>;
}

interface PropertyDetailsResponse {
  data: {
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
  };
}

export const searchPropertyByAddress = async (address: string): Promise<string | null> => {
  try {
    console.log('Searching for property with address:', address);
    
    const response = await fetch(`${BASE_URL}/properties/auto-complete?query=${encodeURIComponent(address)}`, {
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
    
    // Extract URL from data>0>rows>0>url
    if (data.data && data.data[0] && data.data[0].rows && data.data[0].rows[0]) {
      const url = data.data[0].rows[0].url;
      console.log('Found Redfin URL:', url);
      return url;
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

    const data: PropertyDetailsResponse = await response.json();
    
    // Extract sold date and price
    const soldDate = data.data?.avm?.lastSoldDate 
      ? new Date(data.data.avm.lastSoldDate).toLocaleDateString()
      : null;
    const soldPrice = data.data?.avm?.lastSoldPrice || null;

    // Extract listed date and price from events array
    let listedDate: string | null = null;
    let listedPrice: number | null = null;
    
    if (data.data?.belowTheFold?.propertyHistoryInfo?.events) {
      const activeEvent = data.data.belowTheFold.propertyHistoryInfo.events.find(
        event => event.mlsDescription === 'Active'
      );
      
      if (activeEvent) {
        listedDate = new Date(activeEvent.eventDate).toLocaleDateString();
        listedPrice = activeEvent.price;
      }
    }

    // Extract bedrooms and square feet
    const bedrooms = data.data?.avm?.numBeds || null;
    const squareFeet = data.data?.avm?.sqFt?.value || null;

    // Extract region code (regionType_tableId)
    const regionCode = data.data?.primaryRegionInfo 
      ? `${data.data.primaryRegionInfo.regionType}_${data.data.primaryRegionInfo.tableId}`
      : null;

    const propertyData: RedfinPropertyData = {
      soldDate,
      soldPrice,
      listedDate,
      listedPrice,
      bedrooms,
      squareFeet,
      regionCode
    };

    console.log('Extracted property data:', propertyData);
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
