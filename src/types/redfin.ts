
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

export interface AutoCompleteResponse {
  status: boolean;
  message?: string;
  data: Array<{
    rows: Array<{
      url: string;
    }>;
  }>;
}

export interface PropertyDetailsResponse {
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
