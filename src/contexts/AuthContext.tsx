
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
  isConverting: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  checkForExistingReport: () => Promise<boolean>;
  refreshExistingReportCheck: () => Promise<void>;
  requestAccountDeletion: () => Promise<{ error: any }>;
  convertAnonymousReportToUserReport: (userId: string) => Promise<any>;
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
  const [isConverting, setIsConverting] = useState(false);

  const checkForOAuthData = (): boolean => {
    const storedData = sessionStorage.getItem('pendingAccountCreationData');
    if (!storedData) return false;
    
    try {
      const parsedData = JSON.parse(storedData);
      const isRecent = Date.now() - parsedData.timestamp < 600000; // 10 minutes
      return isRecent;
    } catch (error) {
      console.error('Error parsing OAuth data:', error);
      sessionStorage.removeItem('pendingAccountCreationData');
      return false;
    }
  };

  // Function to convert anonymous report to user report
  const convertAnonymousReportToUserReport = async (userId: string) => {
    try {
      console.log('=== AUTH CONTEXT: STARTING CONVERSION ===');
      setIsConverting(true);
      
      const sessionId = getSessionId();
      console.log('Session ID for conversion:', sessionId);
      
      // Get the anonymous report
      const { data: anonymousReport, error: fetchError } = await supabase
        .from('anonymous_reports')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching anonymous report:', fetchError);
        setIsConverting(false);
        return null;
      }

      if (!anonymousReport) {
        console.log('No anonymous report found to convert');
        setIsConverting(false);
        return null;
      }

      console.log('Found anonymous report to convert:', anonymousReport.id);

      // First, mark any existing user reports as inactive
      const { error: deactivateError } = await supabase
        .from('user_reports')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (deactivateError) {
        console.error('Error deactivating existing reports:', deactivateError);
      }

      // Convert to user report
      const { data: userReport, error: convertError } = await supabase
        .from('user_reports')
        .insert({
          user_id: userId,
          analysis_data: anonymousReport.analysis_data,
          property_data: anonymousReport.property_data,
          negotiation_strategy: anonymousReport.negotiation_strategy,
          property_address: anonymousReport.property_address,
          inspection_date: anonymousReport.inspection_date,
          pdf_file_path: anonymousReport.pdf_file_path,
          pdf_text: anonymousReport.pdf_text,
          pdf_metadata: anonymousReport.pdf_metadata,
          is_active: true,
          processing_status: 'completed'
        })
        .select()
        .single();

      if (convertError) {
        console.error('Error converting anonymous report to user report:', convertError);
        setIsConverting(false);
        return null;
      }

      // Update the anonymous report to mark it as converted
      await supabase
        .from('anonymous_reports')
        .update({
          converted_to_user_id: userId,
          converted_at: new Date().toISOString()
        })
        .eq('id', anonymousReport.id);

      console.log('Successfully converted anonymous report to user report');
      console.log('PDF file path preserved:', userReport.pdf_file_path);
      
      // Clear the anonymous session ID since it's now converted
      localStorage.removeItem('anonymous_session_id');
      
      setIsConverting(false);
      return userReport;
    } catch (err) {
      console.error('Error converting anonymous report:', err);
      setIsConverting(false);
      return null;
    }
  };

  const checkForExistingReport = async (): Promise<boolean> => {
    if (!user) return false;

    console.log('=== AUTH CONTEXT: CHECKING FOR EXISTING REPORT ===');
    console.log('User ID:', user.id);
    console.log('Is converting:', isConverting);
    
    // If conversion is in progress, wait for it to complete
    if (isConverting) {
      console.log('Conversion in progress, waiting...');
      return true; // Return true temporarily while converting
    }

    // Check if there's pending OAuth data - if so, return true temporarily
    const hasPendingOAuth = checkForOAuthData();
    if (hasPendingOAuth) {
      console.log('OAuth data pending, reporting hasExistingReport as true temporarily');
      setHasExistingReport(true);
      return true;
    }

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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== AUTH STATE CHANGE ===', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if this is a new user signup (either email or OAuth)
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('User signed in, checking for anonymous report conversion');
            
            // Check if there's an anonymous report to convert
            const sessionId = getSessionId();
            if (sessionId) {
              console.log('Session ID found, attempting conversion');
              const converted = await convertAnonymousReportToUserReport(session.user.id);
              
              if (converted) {
                console.log('Conversion successful, refreshing report check');
                await checkForExistingReport();
              } else {
                console.log('No conversion needed or failed, checking for existing report');
                await checkForExistingReport();
              }
            } else {
              console.log('No session ID found, checking for existing report');
              await checkForExistingReport();
            }
          }
        } else {
          setHasExistingReport(null);
          setIsCheckingForReport(false);
          setIsConverting(false);
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
        // For initial session, check for conversion opportunity
        const sessionId = getSessionId();
        if (sessionId) {
          console.log('Initial session with anonymous data, attempting conversion');
          const converted = await convertAnonymousReportToUserReport(session.user.id);
          
          if (converted) {
            console.log('Initial conversion successful');
            await checkForExistingReport();
          } else {
            await checkForExistingReport();
          }
        } else {
          await checkForExistingReport();
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    setIsConverting(false);
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
    isConverting,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    checkForExistingReport,
    refreshExistingReportCheck,
    requestAccountDeletion,
    convertAnonymousReportToUserReport,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
