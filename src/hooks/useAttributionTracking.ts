import { useEffect } from 'react';
import { initializeAttribution } from '@/utils/attributionUtils';

export const useAttributionTracking = () => {
  useEffect(() => {
    // Initialize attribution data on page load
    initializeAttribution();
  }, []);
};