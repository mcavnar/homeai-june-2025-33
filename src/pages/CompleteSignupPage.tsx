
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Mail, ArrowRight, AlertCircle, Chrome, CheckCircle, Zap, DollarSign, FileText, Users } from 'lucide-react';

const CompleteSignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signUp, signInWithGoogle } = useAuth();
  const { trackConversion } = useMetaConversions();
  const { trackEvent } = useGoogleAnalytics();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisPreview, setAnalysisPreview] = useState<any>(null);

  // Load analysis preview from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('anonymousAnalysisData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAnalysisPreview(data.analysis);
      } catch (err) {
        console.error('Failed to parse stored analysis data:', err);
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/results/synopsis', { replace: true });
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      trackEvent('create_account_post_upload', {
        event_category: 'auth',
        event_label: 'email_signup_post_upload',
        value: 1
      });

      const { error } = await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        await trackConversion({
          eventName: 'CompleteRegistration',
          contentName: 'Email Signup Post Upload'
        });
        setError('Check your email for a confirmation link');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      trackEvent('signup_google_post_upload', {
        event_category: 'auth',
        event_label: 'google_oauth_post_upload',
        value: 1
      });

      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      } else {
        await trackConversion({
          eventName: 'CompleteRegistration',
          contentName: 'Google OAuth Post Upload'
        });
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalCost = analysisPreview?.costSummary?.totalEstimatedCost || 0;
  const issuesCount = analysisPreview?.issues?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Analysis Preview Section */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Analysis is Ready! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Create your free account to access your complete inspection analysis and save it forever.
            </p>
          </div>

          {/* Preview Cards */}
          <div className="space-y-4">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Total Repair Costs</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${totalCost.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Issues Found</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {issuesCount} items
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Plus you'll get access to:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Detailed repair cost breakdowns
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Negotiation strategies and talking points
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Recommended service providers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Full inspection report analysis
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="space-y-6">
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Secure Your Analysis
              </CardTitle>
              <CardDescription className="text-base text-gray-600 mt-2">
                <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  100% Free • No credit card required
                </div>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 px-8 pb-8">
              {/* Primary Google Sign Up Button */}
              <Button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-medium"
              >
                <Chrome className="h-5 w-5" />
                Continue with Google (Fastest)
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">Or use email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <Alert variant={error.includes('Check your email') ? 'default' : 'destructive'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  {loading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Progress Indicator */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-center">
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
                      <span className="ml-2 text-sm text-gray-600">View Full Results</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteSignupPage;
