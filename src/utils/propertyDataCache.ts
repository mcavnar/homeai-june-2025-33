
interface PropertyDataCache {
  [address: string]: {
    data: any;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
  };
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache: PropertyDataCache = {};

export const getCachedPropertyData = (address: string) => {
  const cacheKey = address.toLowerCase().trim();
  const cached = cache[cacheKey];
  
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    console.log('Using cached property data for:', address);
    return cached.data;
  }
  
  // Clean up expired cache entry
  if (cached) {
    delete cache[cacheKey];
  }
  
  return null;
};

export const setCachedPropertyData = (address: string, data: any) => {
  const cacheKey = address.toLowerCase().trim();
  cache[cacheKey] = {
    data,
    timestamp: Date.now(),
    ttl: CACHE_TTL,
  };
  console.log('Cached property data for:', address);
};

export const clearPropertyDataCache = () => {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('Property data cache cleared');
};
