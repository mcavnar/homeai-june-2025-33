import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserReport } from '@/hooks/useUserReport';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, FileText, Clock, Shield, TrendingUp, Loader2 } from 'lucide-react';

const AccountCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn } = useAuth();
  const { saveUserReport } = useUserReport();
  const { trackConversion } = useMetaConversions();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [error, setError] = useState('');

  // Get the analysis data from location state
  const analysisData = location.state;

  // Verify database session by testing a query that uses auth.uid()
  const verifyDatabaseSession = async () => {
    try {
      // Try to query the profiles table with a condition that uses auth.uid()
      // This will fail if auth.uid() is not available in the database context
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', 'test-non-existent-id')
        .limit(1);
      
      // If we get here without an RLS error, the database session is working
      // (even if no data is returned, that's fine - we're just testing auth context)
      if (error && error.message?.includes('row-level security')) {
        console.log('Database session not ready - RLS indicates no auth context');
        return false;
      }
      
      console.log('Database session test successful');
      return true;
    } catch (err) {
      console.error('Database session test failed:', err);
      return false;
    }
  };

  // Wait for both client and database sessions to be ready
  const waitForSession = async (maxRetries = 8, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Check client session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Client session error:', error);
          continue;
        }
        
        if (session?.user?.id) {
          console.log('Client session ready, user ID:', session.user.id);
          
          // Also verify database session
          const dbSessionReady = await verifyDatabaseSession();
          if (dbSessionReady) {
            console.log('Both client and database sessions are ready');
            return session;
          } else {
            console.log('Client session ready but database session not yet available');
          }
        } else {
          console.log('Client session not ready');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
      
      if (i < maxRetries - 1) {
        console.log(`Session not fully ready, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.2, 3000); // Exponential backoff with cap
      }
    }
    throw new Error('Session not ready after maximum retries');
  };

  const saveAnalysisData = async () => {
    if (!analysisData) return;

    setSavingReport(true);
    try {
      // Wait for both client and database sessions to be fully established
      console.log('Waiting for session to be ready...');
      await waitForSession();
      
      // Add a small additional delay to ensure session propagation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Now try to save the report
      console.log('Session ready, saving user report...');
      await saveUserReport({
        analysis_data: analysisData,
        property_address: analysisData.propertyInfo?.address,
        inspection_date: analysisData.propertyInfo?.inspectionDate
      });
      console.log('Successfully saved user report to database');
    } catch (saveError) {
      console.error('Error saving user report:', saveError);
      // Check if it's specifically an RLS error
      if (saveError.message?.includes('row-level security policy')) {
        throw new Error('Session not properly authenticated. Please refresh the page and try again.');
      }
      throw new Error('Failed to save report. Please try uploading again.');
    } finally {
      setSavingReport(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // Track account creation conversion
        await trackConversion({
          eventName: 'CompleteRegistration',
          contentName: 'Account Created from Anonymous Upload'
        });

        // Save the analysis data to the user's database record
        try {
          await saveAnalysisData();
        } catch (saveError) {
          setError(saveError.message);
          setLoading(false);
          return;
        }

        // Navigate to results without passing state (data is now in database)
        navigate('/results/synopsis', { replace: true });

      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        // For existing users signing in, save the analysis data if provided
        try {
          await saveAnalysisData();
        } catch (saveError) {
          setError(`Signed in but ${saveError.message.toLowerCase()}`);
          setLoading(false);
          return;
        }

        // Navigate to results
        navigate('/results/synopsis', { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      setSavingReport(false);
    }
  };

  const benefits = [
    {
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      title: "Save Your Report Forever",
      description: "Access your detailed inspection analysis anytime, anywhere"
    },
    {
      icon: <Clock className="h-5 w-5 text-green-500" />,
      title: "Track Property Over Time",
      description: "Compare multiple inspections and see property condition trends"
    },
    {
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      title: "Secure & Private",
      description: "Your data is encrypted and only accessible to you"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      title: "Enhanced Analytics",
      description: "Get deeper insights and personalized recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Report is Ready! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Create a free account to access your complete inspection analysis
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Upload Complete</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Create Account</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">View Results</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Create an Account?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What You Get Preview */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Your Report Includes:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Executive Summary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Detailed Issue Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Cost Estimates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Negotiation Strategy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">System Evaluations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Creation Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {isSignUp ? 'Create Your Free Account' : 'Sign In to Your Account'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {isSignUp && (
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || savingReport}
                  >
                    {loading || savingReport ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {savingReport ? 'Saving Your Report...' : (isSignUp ? 'Creating Account...' : 'Signing In...')}
                      </>
                    ) : (
                      <>
                        {isSignUp ? 'Create Account & View Results' : 'Sign In & View Results'}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      disabled={loading || savingReport}
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign in' 
                        : 'Need an account? Sign up'
                      }
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 We never spam. Your data is secure and private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;
