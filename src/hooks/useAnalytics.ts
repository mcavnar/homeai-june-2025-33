
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  total_duration_seconds?: number;
}

interface PageVisit {
  id: string;
  user_id: string;
  session_id?: string;
  page_path: string;
  page_title?: string;
  visit_start: string;
  visit_end?: string;
  duration_seconds?: number;
  referrer?: string;
}

interface UserInteraction {
  user_id: string;
  session_id?: string;
  page_visit_id?: string;
  interaction_type: 'button_click' | 'link_click' | 'form_submit' | 'download' | 'navigation';
  element_id?: string;
  element_text?: string;
  element_class?: string;
  page_path: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const currentSessionRef = useRef<AnalyticsSession | null>(null);
  const currentPageVisitRef = useRef<PageVisit | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const pageStartTimeRef = useRef<number>(Date.now());
  const initializationAttempted = useRef<boolean>(false);

  // Clear localStorage on component mount to prevent stale data issues
  useEffect(() => {
    // Clear any stale analytics data
    localStorage.removeItem('analytics_session');
    localStorage.removeItem('analytics_page_visit');
  }, []);

  // Validate user exists in auth system
  const validateUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      return authUser?.id === userId;
    } catch (error) {
      console.warn('Failed to validate user:', error);
      return false;
    }
  }, []);

  // Start a new session when user logs in
  const startSession = useCallback(async () => {
    if (!user?.id || currentSessionRef.current || initializationAttempted.current) {
      return;
    }

    initializationAttempted.current = true;

    try {
      // Validate user exists before creating session
      const userExists = await validateUser(user.id);
      if (!userExists) {
        console.warn('User not found in auth system, skipping analytics session');
        return;
      }

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          user_agent: navigator.userAgent,
        })
        .select()
        .single();

      if (error) {
        // Handle foreign key constraint errors gracefully
        if (error.code === '23503' || error.message.includes('foreign key constraint')) {
          console.warn('User not found in auth system, skipping analytics session');
          return;
        }
        // Handle other 409 conflict errors gracefully
        if (error.code === '23505' || error.message.includes('409')) {
          console.log('Analytics session conflict resolved, continuing...');
          return;
        }
        throw error;
      }

      currentSessionRef.current = data;
      sessionStartTimeRef.current = Date.now();
      console.log('Analytics session started:', data.id);
    } catch (error) {
      console.error('Failed to start analytics session:', error);
      // Don't throw error to prevent breaking the app
      initializationAttempted.current = false;
    }
  }, [user, validateUser]);

  // End the current session
  const endSession = useCallback(async () => {
    if (!currentSessionRef.current) return;

    const duration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);

    try {
      await supabase
        .from('user_sessions')
        .update({
          session_end: new Date().toISOString(),
          total_duration_seconds: duration,
        })
        .eq('id', currentSessionRef.current.id);

      console.log('Analytics session ended:', currentSessionRef.current.id, 'Duration:', duration, 'seconds');
    } catch (error) {
      console.error('Failed to end analytics session:', error);
    } finally {
      currentSessionRef.current = null;
      initializationAttempted.current = false;
    }
  }, []);

  // Track page visit
  const trackPageVisit = useCallback(async (pagePath: string, pageTitle?: string) => {
    if (!user?.id) return;

    try {
      // Validate user exists before creating page visit
      const userExists = await validateUser(user.id);
      if (!userExists) {
        console.warn('User not found in auth system, skipping page visit tracking');
        return;
      }

      // End previous page visit
      if (currentPageVisitRef.current) {
        const duration = Math.floor((Date.now() - pageStartTimeRef.current) / 1000);
        try {
          await supabase
            .from('user_page_visits')
            .update({
              visit_end: new Date().toISOString(),
              duration_seconds: duration,
            })
            .eq('id', currentPageVisitRef.current.id);
        } catch (error) {
          console.error('Failed to end page visit:', error);
        }
      }

      // Start new page visit
      const { data, error } = await supabase
        .from('user_page_visits')
        .insert({
          user_id: user.id,
          session_id: currentSessionRef.current?.id,
          page_path: pagePath,
          page_title: pageTitle || document.title,
          referrer: document.referrer,
        })
        .select()
        .single();

      if (error) {
        // Handle foreign key constraint errors gracefully
        if (error.code === '23503' || error.message.includes('foreign key constraint')) {
          console.warn('User not found in auth system, skipping page visit tracking');
          return;
        }
        // Handle other 409 conflict errors gracefully
        if (error.code === '23505' || error.message.includes('409')) {
          console.log('Page visit conflict resolved, continuing...');
          return;
        }
        throw error;
      }

      currentPageVisitRef.current = data;
      pageStartTimeRef.current = Date.now();
      console.log('Page visit tracked:', pagePath);
    } catch (error) {
      console.error('Failed to track page visit:', error);
    }
  }, [user, validateUser]);

  // Track user interaction
  const trackInteraction = useCallback(async (interaction: Omit<UserInteraction, 'user_id' | 'session_id' | 'page_visit_id'>) => {
    if (!user?.id) return;

    try {
      // Validate user exists before creating interaction
      const userExists = await validateUser(user.id);
      if (!userExists) {
        console.warn('User not found in auth system, skipping interaction tracking');
        return;
      }

      await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          session_id: currentSessionRef.current?.id,
          page_visit_id: currentPageVisitRef.current?.id,
          ...interaction,
        });

      console.log('Interaction tracked:', interaction.interaction_type, interaction.element_text);
    } catch (error) {
      // Handle foreign key constraint errors gracefully
      if (error.code === '23503' || error.message.includes('foreign key constraint')) {
        console.warn('User not found in auth system, skipping interaction tracking');
        return;
      }
      // Handle other 409 conflict errors gracefully
      if (error.code === '23505' || error.message.includes('409')) {
        console.log('Interaction conflict resolved, continuing...');
        return;
      }
      console.error('Failed to track interaction:', error);
    }
  }, [user, validateUser]);

  // Track button click specifically
  const trackButtonClick = useCallback((buttonText: string, elementId?: string, elementClass?: string) => {
    if (!user?.id) return;
    
    trackInteraction({
      interaction_type: 'button_click',
      element_text: buttonText,
      element_id: elementId,
      element_class: elementClass,
      page_path: window.location.pathname,
    });
  }, [user, trackInteraction]);

  // Initialize session when user logs in
  useEffect(() => {
    if (user?.id && !currentSessionRef.current && !initializationAttempted.current) {
      startSession();
    }
  }, [user?.id, startSession]);

  // End session when user logs out or component unmounts
  useEffect(() => {
    return () => {
      if (currentSessionRef.current) {
        endSession();
      }
    };
  }, [endSession]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSessionRef.current) {
        endSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [endSession]);

  return {
    trackPageVisit,
    trackInteraction,
    trackButtonClick,
    currentSession: currentSessionRef.current,
    currentPageVisit: currentPageVisitRef.current,
  };
};
