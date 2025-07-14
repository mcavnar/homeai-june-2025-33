
import { useCallback } from 'react';

interface GoogleAnalyticsEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

export const useGoogleAnalytics = () => {
  const trackEvent = useCallback((eventName: string, parameters: GoogleAnalyticsEvent = {}) => {
    // Check if gtag is available (it's loaded from index.html)
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', eventName, parameters);
        console.log('GA Event tracked:', eventName, parameters);
      } catch (error) {
        console.warn('Failed to track GA event:', error);
      }
    }
  }, []);

  return { trackEvent };
};

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
