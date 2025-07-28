
import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useUnifiedMetaTracking } from '@/hooks/useUnifiedMetaTracking';
import { useAttributionTracking } from '@/hooks/useAttributionTracking';

interface AnalyticsContextType {
  trackButtonClick: (buttonText: string, elementId?: string, elementClass?: string) => void;
  trackInteraction: (interaction: {
    interaction_type: 'button_click' | 'link_click' | 'form_submit' | 'download' | 'navigation';
    element_id?: string;
    element_text?: string;
    element_class?: string;
    page_path: string;
  }) => void;
  trackMetaEvent: (params: {
    eventName: string;
    value?: number;
    currency?: string;
    contentName?: string;
  }) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // Always call hooks at the top level
  const analytics = useAnalytics();
  const metaTracking = useUnifiedMetaTracking();
  
  // Enable page tracking and attribution tracking
  usePageTracking();
  useAttributionTracking();

  const { trackButtonClick, trackInteraction } = analytics;
  const { trackEvent } = metaTracking;

  // Wrap analytics functions with error handling
  const safeTrackButtonClick = (buttonText: string, elementId?: string, elementClass?: string) => {
    try {
      trackButtonClick(buttonText, elementId, elementClass);
    } catch (error) {
      console.error('Button click tracking failed:', error);
    }
  };

  const safeTrackInteraction = (interaction: {
    interaction_type: 'button_click' | 'link_click' | 'form_submit' | 'download' | 'navigation';
    element_id?: string;
    element_text?: string;
    element_class?: string;
    page_path: string;
  }) => {
    try {
      trackInteraction(interaction);
    } catch (error) {
      console.error('Interaction tracking failed:', error);
    }
  };

  const safeTrackMetaEvent = (params: {
    eventName: string;
    value?: number;
    currency?: string;
    contentName?: string;
  }) => {
    try {
      trackEvent(params);
    } catch (error) {
      console.error('Meta event tracking failed:', error);
    }
  };

  const value = {
    trackButtonClick: safeTrackButtonClick,
    trackInteraction: safeTrackInteraction,
    trackMetaEvent: safeTrackMetaEvent,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};
