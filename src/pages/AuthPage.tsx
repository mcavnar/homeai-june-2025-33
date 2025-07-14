
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
import { Mail, ArrowRight, AlertCircle, Chrome, Shield, Users, Clock, CheckCircle, Zap, Star, Award, TrendingUp } from 'lucide-react';

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
        
        {/* Enhanced Header with Social Proof */}
        <div className="text-center space-y-6">
          {/* Top Statistics Bar */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
              <Users className="h-4 w-4 mr-2" />
              25,000+ Reports Analyzed
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-2" />
              $15K Avg. Savings
            </Badge>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Get Your AI Analysis in 2 Minutes
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              {isSignUp 
                ? 'Join thousands using their home inspection report to save money and negotiate more effectively' 
                : 'Welcome back! Continue your analysis'
              }
            </p>
          </div>
          
          {/* Value Proposition Icons */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-white rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg mb-3 border border-gray-100">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Instant Results</p>
              <p className="text-xs text-gray-500 mt-1">AI analysis ready in 2 min</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg mb-3 border border-gray-100">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">100% Free</p>
              <p className="text-xs text-gray-500 mt-1">No credit card required</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg mb-3 border border-gray-100">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Secure & Private</p>
              <p className="text-xs text-gray-500 mt-1">Your data stays safe</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Start Your Free Analysis' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              {isSignUp 
                ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                      <CheckCircle className="h-4 w-4" />
                      No credit card required • Takes 30 seconds
                    </div>
                  </div>
                )
                : 'Sign in to continue your analysis'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            {/* Primary Google Sign In Button */}
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-medium"
            >
              <Chrome className="h-5 w-5" />
              {isSignUp ? 'Continue with Google (Most Popular)' : 'Sign in with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
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

            {/* Enhanced Trust Indicators */}
            <div className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="font-medium">SSL Encrypted</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-blue-600" />
                  <span className="font-medium">30-sec setup</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="font-medium">No spam ever</span>
                </div>
              </div>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up free"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Social Proof Footer */}
        <div className="text-center space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 italic font-medium mb-2">
              "HomeAi saved me $8,500 on my inspection negotiations!"
            </p>
            <p className="text-xs text-gray-500">- Sarah M., First-time Homebuyer</p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2 font-medium">4.9/5 from 3,247 reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
