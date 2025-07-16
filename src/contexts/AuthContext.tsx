
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

  const saveReportViaServer = async (reportData: any, userId: string) => {
    try {
      console.log('Saving report via server for user:', userId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session for saving report');
      }

      const { data, error } = await supabase.functions.invoke('save-user-report', {
        body: reportData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to save report');
      }

      console.log('Successfully saved report via server:', data.report.id);
      return data.report;
    } catch (error) {
      console.error('Error saving report via server:', error);
      throw error;
    }
  };

  const convertAnonymousReportToUserReport = async (userId: string) => {
    try {
      console.log('=== AUTH CONTEXT: STARTING CONVERSION ===');
      setIsConverting(true);
      
      // Check for OAuth data first
      const oauthData = sessionStorage.getItem('pendingAccountCreationData');
      if (oauthData) {
        console.log('Found OAuth data, processing...');
        const parsedData = JSON.parse(oauthData);
        
        // Wait for session to be fully established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const reportData = {
          analysis_data: parsedData.analysis,
          pdf_text: parsedData.pdfText,
          property_address: parsedData.address,
          property_data: parsedData.propertyData,
          negotiation_strategy: parsedData.negotiationStrategy,
        };
        
        console.log('Saving OAuth report data:', reportData);
        const savedReport = await saveReportViaServer(reportData, userId);
        
        // Clear the session storage
        sessionStorage.removeItem('pendingAccountCreationData');
        
        setIsConverting(false);
        return savedReport;
      }
      
      // Check for anonymous report in database
      const sessionId = getSessionId();
      console.log('Session ID for conversion:', sessionId);
      
      if (!sessionId) {
        console.log('No session ID found');
        setIsConverting(false);
        return null;
      }
      
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

      // Wait for session to be fully established
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reportData = {
        analysis_data: anonymousReport.analysis_data,
        property_data: anonymousReport.property_data,
        negotiation_strategy: anonymousReport.negotiation_strategy,
        property_address: anonymousReport.property_address,
        inspection_date: anonymousReport.inspection_date,
        pdf_file_path: anonymousReport.pdf_file_path,
        pdf_text: anonymousReport.pdf_text,
        pdf_metadata: anonymousReport.pdf_metadata,
      };

      console.log('Saving anonymous report data:', reportData);
      const savedReport = await saveReportViaServer(reportData, userId);

      // Mark the anonymous report as converted
      await supabase
        .from('anonymous_reports')
        .update({
          converted_to_user_id: userId,
          converted_at: new Date().toISOString()
        })
        .eq('id', anonymousReport.id);

      console.log('Successfully converted anonymous report to user report');
      
      // Clear the anonymous session ID
      localStorage.removeItem('anonymous_session_id');
      
      setIsConverting(false);
      return savedReport;
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
      return true;
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
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('User signed in, checking for conversion opportunity');
            
            // Use setTimeout to avoid blocking the auth state change
            setTimeout(async () => {
              try {
                console.log('Attempting conversion for user:', session.user.id);
                const converted = await convertAnonymousReportToUserReport(session.user.id);
                
                if (converted) {
                  console.log('Conversion successful, refreshing report check');
                  await checkForExistingReport();
                } else {
                  console.log('No conversion needed, checking for existing report');
                  await checkForExistingReport();
                }
              } catch (error) {
                console.error('Error in conversion process:', error);
                await checkForExistingReport();
              }
            }, 100);
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
        setTimeout(async () => {
          try {
            console.log('Initial session check, attempting conversion');
            const converted = await convertAnonymousReportToUserReport(session.user.id);
            
            if (converted) {
              console.log('Initial conversion successful');
              await checkForExistingReport();
            } else {
              await checkForExistingReport();
            }
          } catch (error) {
            console.error('Error in initial conversion:', error);
            await checkForExistingReport();
          }
        }, 100);
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
