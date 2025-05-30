
import { createApiRequest } from './redfinApiClient';
import { PropertyDetailsResponse, RedfinPropertyData } from '@/types/redfin';

const extractPropertyData = (data: PropertyDetailsResponse): RedfinPropertyData => {
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

  // Extract basic property info
  const bedrooms = data?.avm?.numBeds || null;
  const squareFeet = data?.avm?.sqFt?.value || null;
  const regionCode = data?.primaryRegionInfo 
    ? `${data.primaryRegionInfo.regionType}_${data.primaryRegionInfo.tableId}`
    : null;

  // Extract neighborhood market insights
  const neighborhoodAvgDaysOnMarket = data?.marketInsightsInfo?.competeScoreInfo?.aggs?.dom || null;
  const neighborhoodAvgSaleToListRatio = data?.marketInsightsInfo?.competeScoreInfo?.aggs?.saleToList || null;
  
  // Calculate nearby homes average square feet
  let nearbyHomesAvgSquareFeet: number | null = null;
  
  if (data?.nearbyhomes?.nearbyHomeDataList) {
    const squareFeetValues = data.nearbyhomes.nearbyHomeDataList
      .map(home => home.sqFt?.value)
      .filter((value): value is number => value !== undefined && value !== null);
    
    if (squareFeetValues.length > 0) {
      nearbyHomesAvgSquareFeet = Math.round(
        squareFeetValues.reduce((sum, value) => sum + value, 0) / squareFeetValues.length
      );
    }
  }

  return {
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
};

export const getPropertyDetails = async (redfinUrl: string): Promise<RedfinPropertyData> => {
  try {
    console.log('Fetching property details for URL:', redfinUrl);
    
    const response = await createApiRequest(`/properties/details?url=${encodeURIComponent(redfinUrl)}`);

    if (!response.ok) {
      throw new Error(`Property details API error: ${response.status}`);
    }

    const response_data = await response.json();
    console.log('Full API Response:', JSON.stringify(response_data, null, 2));
    
    const data: PropertyDetailsResponse = response_data.data;
    const propertyData = extractPropertyData(data);

    console.log('Final extracted property data:', propertyData);
    return propertyData;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
