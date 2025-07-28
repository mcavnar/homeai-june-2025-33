
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { initializeAttribution, type AttributionData } from '@/utils/attributionUtils';

interface TrackEventParams {
  eventName: string;
  value?: number;
  currency?: string;
  contentName?: string;
}

export const useUnifiedMetaTracking = () => {
  const { user } = useAuth();

  const trackEvent = async ({
    eventName,
    value,
    currency = 'USD',
    contentName
  }: TrackEventParams) => {
    try {
      // Get attribution data for this event
      const attributionData = initializeAttribution();
      
      // Generate unique event ID for deduplication
      const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Tracking unified Meta event:', { eventName, eventId, value, attributionData });

      // 1. Fire client-side Meta Pixel event (if fbq is available)
      if (typeof window !== 'undefined' && window.fbq) {
        const pixelEventData: any = {
          event_id: eventId,
        };

        if (value) {
          pixelEventData.value = value;
          pixelEventData.currency = currency;
        }

        if (contentName) {
          pixelEventData.content_name = contentName;
        }

        // Track the event with Meta Pixel
        window.fbq('track', eventName, pixelEventData);
        console.log('Meta Pixel event fired:', eventName, pixelEventData);
      }

      // 2. Fire server-side Conversions API event
      const { data, error } = await supabase.functions.invoke('meta-conversions', {
        body: {
          eventName,
          eventId, // Same event_id for deduplication
          userEmail: user?.email,
          userAgent: navigator.userAgent,
          value,
          currency,
          contentName,
          eventSourceUrl: window.location.href,
          attributionData
        }
      });

      if (error) {
        console.error('Meta Conversions API error:', error);
        return { success: false, error };
      }

      console.log('Unified Meta tracking completed successfully:', data);
      return { success: true, data };

    } catch (error) {
      console.error('Unified Meta tracking failed:', error);
      return { success: false, error };
    }
  };

  return { trackEvent };
};

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}
