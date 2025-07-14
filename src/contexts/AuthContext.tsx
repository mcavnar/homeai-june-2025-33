
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasExistingReport: boolean | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkForExistingReport: () => Promise<void>;
  associateAnonymousData: (userId: string) => Promise<any>;
  requestAccountDeletion: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExistingReport, setHasExistingReport] = useState<boolean | null>(null);

  const checkForExistingReport = async () => {
    if (!user) {
      setHasExistingReport(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user report:', error);
        setHasExistingReport(false);
      } else {
        setHasExistingReport(!!data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setHasExistingReport(false);
    }
  };

  // New function to associate anonymous data with authenticated user
  const associateAnonymousData = async (userId: string) => {
    try {
      const storedData = sessionStorage.getItem('anonymousAnalysisData');
      if (storedData) {
        const data = JSON.parse(storedData);
        
        console.log('Associating anonymous data with user:', userId);
        
        // Save the analysis to user_reports table
        const { data: reportData, error: saveError } = await supabase
          .from('user_reports')
          .insert({
            user_id: userId,
            analysis_data: data.analysis,
            property_address: data.analysis?.propertyInfo?.address,
            inspection_date: data.analysis?.propertyInfo?.inspectionDate,
            pdf_text: data.pdfText,
            pdf_metadata: {
              sessionId: data.sessionId,
              timestamp: data.timestamp
            },
            is_active: true,
            processing_status: 'completed'
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving anonymous data:', saveError);
          throw saveError;
        }

        console.log('Successfully associated anonymous data:', reportData?.id);
        
        // Clear the temporary storage
        sessionStorage.removeItem('anonymousAnalysisData');
        sessionStorage.removeItem('anonymousSessionId');
        
        // Update the hasExistingReport state
        setHasExistingReport(true);
        
        return reportData;
      }
    } catch (error) {
      console.error('Failed to associate anonymous data:', error);
      throw error;
    }
  };

  const requestAccountDeletion = async () => {
    if (!user) {
      return { error: { message: 'No user found' } };
    }

    try {
      // Update the user's profile to mark deletion as requested  
      const { error } = await supabase
        .from('profiles')
        .update({ deletion_requested_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('Error requesting account deletion:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Unexpected error requesting account deletion:', error);
      return { error: error };
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle successful authentication
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Try to associate any anonymous data
            const reportData = await associateAnonymousData(session.user.id);
            
            // If we successfully associated anonymous data, redirect to results
            if (reportData) {
              console.log('Redirecting to results after anonymous data association');
              window.location.href = '/results/synopsis';
              return;
            }
          } catch (error) {
            console.error('Failed to associate anonymous data:', error);
          }
          
          // Check for existing report and redirect accordingly
          setTimeout(async () => {
            await checkForExistingReport();
            
            // If user has an existing report, redirect to results
            const { data, error } = await supabase
              .from('user_reports')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('is_active', true)
              .maybeSingle();
            
            if (!error && data) {
              console.log('User has existing report, redirecting to results');
              window.location.href = '/results/synopsis';
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setHasExistingReport(null);
        }
        
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkForExistingReport();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/results/synopsis`
        }
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error: error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      return { error: error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/results/synopsis`
        }
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Google signin error:', error);
      return { error: error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    hasExistingReport,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    checkForExistingReport,
    associateAnonymousData,
    requestAccountDeletion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
