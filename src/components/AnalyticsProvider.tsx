
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
  
  // Enable page tracking
  usePageTracking();

  const value = {
    trackButtonClick,
    trackInteraction,
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
