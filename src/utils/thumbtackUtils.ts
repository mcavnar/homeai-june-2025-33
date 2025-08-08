
// Utility functions for Thumbtack integration

/**
 * Extract zip code from address string
 * Supports both 5-digit and 5+4 format zip codes
 */
export const extractZipFromAddress = (address: string): string | null => {
  if (!address) {
    console.log('extractZipFromAddress: No address provided');
    return null;
  }
  
  console.log('extractZipFromAddress: Processing address:', address);
  
  // Match 5-digit or 5+4 digit zip codes at the end of the address
  const zipRegex = /\b(\d{5}(?:-\d{4})?)\b(?:\s*$)/;
  const match = address.match(zipRegex);
  
  if (match) {
    const zip = match[1].substring(0, 5);
    console.log('extractZipFromAddress: Extracted zip:', zip);
    return zip;
  }
  
  console.log('extractZipFromAddress: No zip code found in address');
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

/**
 * Generate Thumbtack search query from issue category and description
 * Maps generic categories to Handyman services and truncates to 64 character limit
 */
export const generateThumbTackSearchQuery = (issue: { category: string; description: string }): string => {
  // Map generic categories to Handyman services
  const categoryMap: Record<string, string> = {
    "Interior": "Interior Handyman",
    "Exterior": "Exterior Handyman", 
    "Safety": "Safety Handyman"
  };

  // Use mapped category or original category
  const category = categoryMap[issue.category] || issue.category;
  
  // Format as "{Category}. {description}"
  const fullQuery = `${category}. ${issue.description}`;
  
  // Truncate to exactly 64 characters if needed
  if (fullQuery.length <= 64) {
    return fullQuery;
  }
  
  return fullQuery.substring(0, 64);
};
