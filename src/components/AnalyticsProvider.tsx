
import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePageTracking } from '@/hooks/usePageTracking';

interface AnalyticsContextType {
  trackButtonClick: (buttonText: string, elementId?: string, elementClass?: string) => void;
  trackInteraction: (interaction: {
    interaction_type: 'button_click' | 'link_click' | 'form_submit' | 'download' | 'navigation';
    element_id?: string;
    element_text?: string;
    element_class?: string;
    page_path: string;
  }) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { trackButtonClick, trackInteraction } = useAnalytics();
  
  // Enable page tracking with error boundary
  try {
    usePageTracking();
  } catch (error) {
    console.error('Page tracking failed:', error);
  }

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

  const value = {
    trackButtonClick: safeTrackButtonClick,
    trackInteraction: safeTrackInteraction,
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
