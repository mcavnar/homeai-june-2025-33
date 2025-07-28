export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
}

const ATTRIBUTION_STORAGE_KEY = 'meta_attribution_data';

export const extractAttributionData = (): AttributionData => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const attribution: AttributionData = {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    fbclid: urlParams.get('fbclid') || undefined,
    gclid: urlParams.get('gclid') || undefined,
    referrer: document.referrer || undefined,
    landing_page: window.location.href,
  };

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(attribution).filter(([_, value]) => value !== undefined)
  ) as AttributionData;
};

export const storeAttributionData = (attribution: AttributionData): void => {
  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch (error) {
    console.warn('Failed to store attribution data:', error);
  }
};

export const getStoredAttributionData = (): AttributionData | null => {
  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to retrieve attribution data:', error);
    return null;
  }
};

export const initializeAttribution = (): AttributionData => {
  // Check if we already have attribution data stored
  let attribution = getStoredAttributionData();
  
  // If no stored data or if we have new URL parameters, extract fresh data
  const currentAttribution = extractAttributionData();
  
  if (!attribution || Object.keys(currentAttribution).length > 0) {
    // Merge existing stored data with new URL parameters (new params take precedence)
    attribution = { ...attribution, ...currentAttribution };
    storeAttributionData(attribution);
  }
  
  return attribution || {};
};