
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMetaConversions } from '@/hooks/useMetaConversions';
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
  const { trackConversion } = useMetaConversions();
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the analysis data from location state
  const analysisData = location.state;

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

        // Navigate to results with the analysis data
        navigate('/results/synopsis', { 
          state: analysisData,
          replace: true
        });

      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        // Navigate to results
        navigate('/results/synopsis', { 
          state: analysisData,
          replace: true
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
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
