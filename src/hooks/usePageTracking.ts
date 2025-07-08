
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';

export const usePageTracking = () => {
  const location = useLocation();
  const { trackPageVisit } = useAnalytics();

  useEffect(() => {
    // Track page visit whenever route changes
    trackPageVisit(location.pathname);
  }, [location.pathname, trackPageVisit]);

  return {
    currentPath: location.pathname,
  };
};
