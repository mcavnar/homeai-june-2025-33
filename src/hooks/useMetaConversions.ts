
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TrackConversionParams {
  eventName: string;
  value?: number;
  currency?: string;
  contentName?: string;
}

export const useMetaConversions = () => {
  const { user } = useAuth();

  const trackConversion = async ({
    eventName,
    value,
    currency = 'USD',
    contentName
  }: TrackConversionParams) => {
    try {
      // Generate unique event ID for deduplication
      const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Tracking Meta conversion:', { eventName, eventId, value });

      const { data, error } = await supabase.functions.invoke('meta-conversions', {
        body: {
          eventName,
          eventId,
          userEmail: user?.email,
          userAgent: navigator.userAgent,
          value: value, // Ensure value is passed as number
          currency,
          contentName,
          eventSourceUrl: window.location.href
        }
      });

      if (error) {
        console.error('Meta conversion tracking error:', error);
        return { success: false, error };
      }

      console.log('Meta conversion tracked successfully:', data);
      return { success: true, data };

    } catch (error) {
      console.error('Meta conversion tracking failed:', error);
      return { success: false, error };
    }
  };

  return { trackConversion };
};
