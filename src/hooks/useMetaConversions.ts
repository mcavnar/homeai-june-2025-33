
import { useUnifiedMetaTracking } from './useUnifiedMetaTracking';

interface TrackConversionParams {
  eventName: string;
  value?: number;
  currency?: string;
  contentName?: string;
}

export const useMetaConversions = () => {
  const { trackEvent } = useUnifiedMetaTracking();

  const trackConversion = async (params: TrackConversionParams) => {
    return await trackEvent(params);
  };

  return { trackConversion };
};
