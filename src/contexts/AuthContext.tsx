
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  const checkForExistingReport = async (): Promise<boolean> => {
    if (!user) return false;

    console.log('=== AUTH CONTEXT: CHECKING FOR EXISTING REPORT ===');
    console.log('User ID:', user.id);
    
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
