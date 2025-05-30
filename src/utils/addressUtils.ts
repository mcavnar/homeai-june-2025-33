
export const cleanAddressForDisplay = (address: string): string => {
  // Remove zipcode (5 digits, or 5+4 format) for display
  return address.replace(/\s+\d{5}(-\d{4})?$/, '').trim();
};

export const cleanAddressForSearch = (address: string): string => {
  // Remove zipcode (5 digits, or 5+4 format)
  let cleaned = address.replace(/\s+\d{5}(-\d{4})?$/, '');
  
  // Normalize state abbreviations
  cleaned = cleaned.replace(/,\s*Florida\s*$/i, ', FL');
  
  return cleaned.trim();
};
