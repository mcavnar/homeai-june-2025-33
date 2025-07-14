
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
      console.log('Checking for existing report for user:', user.id);
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
        console.log('Existing report check result:', !!data);
        setHasExistingReport(!!data);
      }
    } catch (error) {
      console.error('Unexpected error checking for existing report:', error);
      setHasExistingReport(false);
    }
  };

  // Function to associate anonymous data with authenticated user
  const associateAnonymousData = async (userId: string) => {
    try {
      console.log('Starting anonymous data association for user:', userId);
      
      // First, check sessionStorage for anonymous data
      const storedData = sessionStorage.getItem('anonymousAnalysisData');
      console.log('Anonymous data in sessionStorage:', !!storedData);
      
      if (storedData) {
        const data = JSON.parse(storedData);
        console.log('Found anonymous data to associate:', {
          hasAnalysis: !!data.analysis,
          sessionId: data.sessionId,
          timestamp: data.timestamp
        });
        
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
              timestamp: data.timestamp,
              fileName: data.fileName,
              fileSize: data.fileSize
            },
            is_active: true,
            processing_status: 'completed'
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving anonymous data to user_reports:', saveError);
          throw saveError;
        }

        console.log('Successfully associated anonymous data with user report:', reportData?.id);
        
        // Clear the temporary storage
        sessionStorage.removeItem('anonymousAnalysisData');
        sessionStorage.removeItem('anonymousSessionId');
        
        // Update the hasExistingReport state
        setHasExistingReport(true);
        
        return reportData;
      }

      // Fallback: Check for existing analysis_sessions by user email
      console.log('No sessionStorage data found, checking for existing analysis_sessions...');
      const { data: existingSessions, error: sessionError } = await supabase
        .from('analysis_sessions')
        .select('*')
        .eq('user_email', user?.email)
        .is('user_id', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessionError) {
        console.error('Error checking for existing sessions:', sessionError);
        return null;
      }

      if (existingSessions && existingSessions.length > 0) {
        const session = existingSessions[0];
        console.log('Found existing analysis session to associate:', session.id);

        if (session.analysis_data) {
          // Save to user_reports
          const { data: reportData, error: saveError } = await supabase
            .from('user_reports')
            .insert({
              user_id: userId,
              analysis_data: session.analysis_data,
              property_address: session.property_address,
              pdf_text: session.extracted_text,
              pdf_metadata: {
                sessionId: session.session_id,
                originalSessionId: session.id
              },
              is_active: true,
              processing_status: 'completed'
            })
            .select()
            .single();

          if (saveError) {
            console.error('Error saving session data to user_reports:', saveError);
            throw saveError;
          }

          console.log('Successfully associated session data with user report:', reportData?.id);

          // Update the original session with user_id
          await supabase
            .from('analysis_sessions')
            .update({ user_id: userId })
            .eq('id', session.id);

          setHasExistingReport(true);
          return reportData;
        }
      }

      console.log('No anonymous data found to associate');
      return null;
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
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle successful authentication
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, checking for data association...');
          
          try {
            // Try to associate anonymous data
            const reportData = await associateAnonymousData(session.user.id);
            
            if (reportData) {
              console.log('Successfully associated data, redirecting to results...');
              // Redirect after successful data association
              setTimeout(() => {
                window.location.href = '/results/synopsis';
              }, 500);
              return;
            }
            
            // If no anonymous data, check for existing reports
            console.log('No anonymous data associated, checking for existing reports...');
            const { data: existingReport, error } = await supabase
              .from('user_reports')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('is_active', true)
              .maybeSingle();
            
            if (!error && existingReport) {
              console.log('User has existing report, redirecting to results...');
              setHasExistingReport(true);
              setTimeout(() => {
                window.location.href = '/results/synopsis';
              }, 500);
            } else {
              console.log('No existing report found, staying on current page');
              setHasExistingReport(false);
            }
          } catch (error) {
            console.error('Error during post-authentication setup:', error);
            setHasExistingReport(false);
          }
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
      console.log('Initial session:', session?.user?.email);
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
      console.log('Signing up user:', email);
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
      console.log('Signing in user:', email);
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
      console.log('Signing in with Google...');
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
      console.log('Signing out user...');
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
