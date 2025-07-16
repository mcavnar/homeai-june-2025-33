
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/utils/sessionUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasExistingReport: boolean | null;
  isCheckingForReport: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  checkForExistingReport: () => Promise<boolean>;
  refreshExistingReportCheck: () => Promise<void>;
  requestAccountDeletion: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExistingReport, setHasExistingReport] = useState<boolean | null>(null);
  const [isCheckingForReport, setIsCheckingForReport] = useState(false);

  const checkForExistingReport = async (): Promise<boolean> => {
    if (!user) return false;

    console.log('=== AUTH CONTEXT: CHECKING FOR EXISTING REPORT ===');
    console.log('User ID:', user.id);
    
    setIsCheckingForReport(true);

    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking for existing report:', error);
        setIsCheckingForReport(false);
        return false;
      }

      const exists = !!data;
      console.log('Report check result:', exists);
      setHasExistingReport(exists);
      setIsCheckingForReport(false);
      return exists;
    } catch (err) {
      console.error('Error checking for existing report:', err);
      setHasExistingReport(false);
      setIsCheckingForReport(false);
      return false;
    }
  };

  const refreshExistingReportCheck = async (): Promise<void> => {
    console.log('=== AUTH CONTEXT: REFRESHING REPORT CHECK ===');
    if (user) {
      await checkForExistingReport();
    }
  };

  // Helper function to convert anonymous report to user report
  const convertAnonymousReport = async (userId: string): Promise<void> => {
    try {
      const sessionId = getSessionId();
      console.log('Converting anonymous report for session:', sessionId);

      // Check if there's an anonymous report for this session
      const { data: anonymousReport, error: anonymousError } = await supabase
        .from('anonymous_reports')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (anonymousError) {
        console.error('Error fetching anonymous report:', anonymousError);
        return;
      }

      if (!anonymousReport) {
        console.log('No anonymous report found for session');
        return;
      }

      console.log('Found anonymous report to convert:', anonymousReport.id);

      // Use the save-user-report edge function to handle the conversion
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        console.error('No active session for conversion');
        return;
      }

      const { data, error: conversionError } = await supabase.functions.invoke('save-user-report', {
        body: {
          analysis_data: anonymousReport.analysis_data,
          property_data: anonymousReport.property_data,
          negotiation_strategy: anonymousReport.negotiation_strategy,
          pdf_file_path: anonymousReport.pdf_file_path,
          pdf_text: anonymousReport.pdf_text,
          pdf_metadata: anonymousReport.pdf_metadata,
          property_address: anonymousReport.property_address,
          inspection_date: anonymousReport.inspection_date,
          convert_from_anonymous: true,
          anonymous_session_id: sessionId
        },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (conversionError) {
        console.error('Error converting anonymous report:', conversionError);
        return;
      }

      console.log('Successfully converted anonymous report:', data);
      
      // Mark the anonymous report as converted
      await supabase
        .from('anonymous_reports')
        .update({
          converted_to_user_id: userId,
          converted_at: new Date().toISOString()
        })
        .eq('id', anonymousReport.id);

      console.log('Anonymous report marked as converted');
    } catch (error) {
      console.error('Error in convertAnonymousReport:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== AUTH STATE CHANGE ===', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // If this is a new user signup, try to convert anonymous report
          if (event === 'SIGNED_UP') {
            console.log('New user signed up, attempting to convert anonymous report');
            await convertAnonymousReport(session.user.id);
          }
          
          // Check for existing report when user logs in
          await checkForExistingReport();
        } else {
          setHasExistingReport(null);
          setIsCheckingForReport(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('=== INITIAL SESSION CHECK ===', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // For existing sessions, also try to convert any pending anonymous reports
        await convertAnonymousReport(session.user.id);
        await checkForExistingReport();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update hasExistingReport when user changes
  useEffect(() => {
    if (user) {
      checkForExistingReport();
    } else {
      setHasExistingReport(null);
      setIsCheckingForReport(false);
    }
  }, [user]);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async (redirectTo: string = '/results/synopsis') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`
      }
    });
    return { error };
  };

  const signOut = async () => {
    // Clear session storage before signing out
    sessionStorage.clear();
    setHasExistingReport(null);
    setIsCheckingForReport(false);
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const requestAccountDeletion = async () => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ deletion_requested_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('Error requesting account deletion:', error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Error requesting account deletion:', err);
      return { error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    hasExistingReport,
    isCheckingForReport,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    checkForExistingReport,
    refreshExistingReportCheck,
    requestAccountDeletion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
