
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowRight } from 'lucide-react';

const EmailCapture = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store email in session storage for the upload process
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('emailCaptureSource', 'get-started');
      
      // Navigate to upload page
      navigate('/upload');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get Started with Your Analysis
          </h1>
          <p className="text-gray-600">
            Enter your email to continue with your home inspection report analysis
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Almost There!</CardTitle>
            <CardDescription>
              We'll use your email to send you a copy of your analysis results
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  'Processing...'
                ) : (
                  <>
                    Continue to Upload
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Next: Upload your home inspection PDF for analysis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Get Started</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Email</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Upload</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                4
              </div>
              <span className="ml-2 text-sm text-gray-600">Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
