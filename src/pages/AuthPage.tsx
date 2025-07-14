
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, ArrowRight, AlertCircle, Chrome, Shield, Users, Clock, CheckCircle, Zap, Star } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, signUp, signIn, signInWithGoogle, hasExistingReport } = useAuth();
  const { trackConversion } = useMetaConversions();
  const { trackEvent } = useGoogleAnalytics();
  
  // Check if mode=signin is in URL params, otherwise default to signup
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') !== 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && hasExistingReport !== null) {
      const from = location.state?.from?.pathname;
      
      // If user has existing report, go to results, otherwise go to upload
      if (hasExistingReport) {
        navigate(from || '/results/synopsis', { replace: true });
      } else {
        navigate(from || '/upload', { replace: true });
      }
    }
  }, [user, hasExistingReport, navigate, location]);

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
      // Track Google Analytics event for email account creation
      if (isSignUp) {
        trackEvent('create_account_click', {
          event_category: 'auth',
          event_label: 'email_signup',
          value: 1
        });
      }

      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        // Track successful registration for sign-up
        if (isSignUp) {
          await trackConversion({
            eventName: 'CompleteRegistration',
            contentName: 'Email Signup'
          });
          setError('Check your email for a confirmation link');
        }
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
      // Track Google Analytics event
      trackEvent('signup_google_click', {
        event_category: 'auth',
        event_label: 'google_oauth',
        value: 1
      });

      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      } else {
        // Track successful Google registration
        await trackConversion({
          eventName: 'CompleteRegistration',
          contentName: 'Google OAuth'
        });
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        
        {/* Header with Social Proof */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              <Users className="h-3 w-3 mr-1" />
              15,000+ Reports Analyzed
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              $12K Avg. Savings
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Get Your AI Analysis in 2 Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {isSignUp 
              ? 'Join thousands saving money on home inspections' 
              : 'Welcome back! Continue your analysis'
            }
          </p>
          
          {/* Benefits Preview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-white rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center shadow-sm mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Instant Results</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center shadow-sm mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">100% Free</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center shadow-sm mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Secure & Private</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              {isSignUp ? 'Start Your Free Analysis' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-base">
              {isSignUp 
                ? 'No credit card required • Takes 30 seconds'
                : 'Sign in to continue your analysis'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Sign In Button - Made Primary */}
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="default"
              className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Chrome className="h-5 w-5" />
              {isSignUp ? 'Continue with Google (Recommended)' : 'Sign in with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-muted-foreground">Or use email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
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
                  className="h-12"
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
                  className="h-12"
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
                className="w-full"
                size="lg"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {isSignUp ? 'Create Free Account' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Trust Indicators */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>30-sec setup</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>No spam ever</span>
                </div>
              </div>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 underline font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up free"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof Footer */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 italic">
            "HomeAi saved me $8,500 on my inspection negotiations!" - Sarah M.
          </p>
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.9/5 from 2,847 reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
