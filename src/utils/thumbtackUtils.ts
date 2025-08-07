
// Utility functions for Thumbtack integration

/**
 * Extract zip code from address string
 * Supports both 5-digit and 5+4 format zip codes
 */
export const extractZipFromAddress = (address: string): string | null => {
  if (!address) return null;
  
  // Match 5-digit or 5+4 digit zip codes at the end of the address
  const zipRegex = /\b(\d{5}(?:-\d{4})?)\b(?:\s*$)/;
  const match = address.match(zipRegex);
  
  if (match) {
    // Return just the 5-digit portion for API compatibility
    return match[1].substring(0, 5);
  }
  
  return null;
};

/**
 * Get demo zip code for testing purposes
 */
export const getDemoZipCode = (): string => {
  return "62704"; // Springfield, IL zip code from demo data
};

/**
 * Map service types to Thumbtack category IDs
 */
export const getThumbTackCategoryId = (serviceType: string): string => {
  const categoryMap: Record<string, string> = {
    "Lawn Care": "lawn-care",
    "House Cleaning": "house-cleaning",
    "Plumbing": "plumbing", 
    "HVAC": "hvac",
    "Electrical": "electrical",
    "Roofing": "roofing",
    "Painting": "interior-painting",
    "Landscaping": "landscaping",
    "Handyman": "handyman",
    "Pest Control": "pest-control"
  };

  return categoryMap[serviceType] || serviceType.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Check if currently in demo mode based on current path
 */
export const isDemoMode = (pathname: string): boolean => {
  return pathname.includes('/demo/');
};
