import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServerUserReport } from '@/hooks/useServerUserReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle, Chrome } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const AccountCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signUp, signInWithGoogle } = useAuth();
  const { saveUserReportViaServer, isLoading, error } = useServerUserReport();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Get analysis data from location state - corrected to use the actual structure
  const analysisData = location.state?.analysis;
  const pdfArrayBuffer = location.state?.pdfArrayBuffer;
  const pdfText = location.state?.pdfText;
  const propertyData = location.state?.propertyData;
  const negotiationStrategy = location.state?.negotiationStrategy;
  const address = location.state?.address;

  console.log('=== ACCOUNT CREATION DEBUG ===');
  console.log('Full location.state:', location.state);
  console.log('Analysis data:', analysisData);
  console.log('Property data:', propertyData);
  console.log('Negotiation strategy:', negotiationStrategy);
  console.log('Address from state:', address);

  useEffect(() => {
    if (!analysisData) {
      console.log('No analysis data found, redirecting to anonymous upload');
      navigate('/anonymous-upload');
    }
  }, [analysisData, navigate]);

  const extractPropertyAddress = (analysisData: any): string | undefined => {
    console.log('=== DEBUGGING PROPERTY ADDRESS EXTRACTION ===');
    console.log('Full analysisData structure:', JSON.stringify(analysisData, null, 2));
    
    if (!analysisData) {
      console.log('No analysis data provided');
      return undefined;
    }

    // First try the address passed directly in the result
    if (address && typeof address === 'string') {
      console.log('Found address in result.address:', address);
      return address;
    }

    // Try multiple ways to extract the property address with detailed logging
    const possibleAddresses = [
      analysisData?.propertyInfo?.address,
      analysisData?.address,
      analysisData?.property?.address,
      analysisData?.propertyDetails?.address,
      analysisData?.location?.address,
      analysisData?.propertyInformation?.address,
      analysisData?.inspection?.property?.address,
      analysisData?.report?.property?.address,
    ];

    for (const addr of possibleAddresses) {
      if (addr && typeof addr === 'string' && addr.trim().length > 0) {
        console.log('Found address:', addr);
        return addr;
      }
    }

    // Deep search for any field that might contain an address
    const searchForAddress = (obj: any, path: string = ''): string | undefined => {
      if (typeof obj === 'string' && obj.includes(' ') && (obj.includes(',') || obj.includes('St') || obj.includes('Ave') || obj.includes('Rd') || obj.includes('Blvd'))) {
        console.log(`Potential address found at ${path}:`, obj);
        return obj;
      }
      
      if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          const result = searchForAddress(value, `${path}.${key}`);
          if (result) return result;
        }
      }
      
      return undefined;
    };
    
    const foundAddress = searchForAddress(analysisData);
    if (foundAddress) {
      console.log('Found address through deep search:', foundAddress);
      return foundAddress;
    }
    
    console.log('No address found in any expected locations');
    console.log('Available keys in analysisData:', Object.keys(analysisData || {}));
    return undefined;
  };

  const storeDataInSessionStorage = () => {
    const storageData = {
      analysis: analysisData,
      pdfText,
      propertyData,
      negotiationStrategy,
      address,
      pdfArrayBuffer: null, // Can't store ArrayBuffer in sessionStorage
      timestamp: Date.now()
    };
    
    console.log('Storing data in sessionStorage for OAuth flow:', storageData);
    sessionStorage.setItem('pendingAccountCreationData', JSON.stringify(storageData));
  };

  const saveReportForUser = async () => {
    if (!analysisData) {
      throw new Error('Analysis data not found. Please upload your report again.');
    }

    // Wait a moment for the user to be fully created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract property address from analysis data with detailed logging
    const propertyAddress = extractPropertyAddress(analysisData);
    console.log('Final extracted property address:', propertyAddress);
    
    if (!propertyAddress) {
      console.warn('WARNING: No property address could be extracted from analysis data');
    }
    
    // Save the user report with proper property address
    const reportData = {
      analysis_data: analysisData,
      pdf_text: pdfText,
      property_address: propertyAddress,
      inspection_date: analysisData?.propertyInfo?.inspectionDate || analysisData?.inspectionDate,
      property_data: propertyData,
      negotiation_strategy: negotiationStrategy,
    };
    
    console.log('Saving user report with data:', {
      hasAnalysisData: !!reportData.analysis_data,
      propertyAddress: reportData.property_address,
      inspectionDate: reportData.inspection_date,
      hasPropertyData: !!reportData.property_data,
      hasNegotiationStrategy: !!reportData.negotiation_strategy,
    });
    
    await saveUserReportViaServer(reportData);
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setIsCreatingAccount(true);

    try {
      // Store data in sessionStorage before OAuth redirect
      storeDataInSessionStorage();
      
      console.log('Starting Google authentication with redirect to /results/synopsis');
      const { error } = await signInWithGoogle('/results/synopsis');
      
      if (error) {
        setAuthError(error.message);
        // Clear stored data if OAuth fails
        sessionStorage.removeItem('pendingAccountCreationData');
        return;
      }

      // The rest will be handled by the Results component after OAuth redirect
    } catch (err) {
      console.error('Google auth error:', err);
      setAuthError('Google sign-in failed. Please try again.');
      sessionStorage.removeItem('pendingAccountCreationData');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAccount(true);
    setAuthError('');
    
    try {
      console.log('Creating account for:', email);
      const { error } = await signUp(email, password);
      
      if (error) {
        setAuthError(error.message);
        return;
      }

      await saveReportForUser();
      
      setAccountCreated(true);
      
      toast({
        title: "Account created successfully!",
        description: "Your inspection report has been saved to your account.",
      });
      
      // Navigate to results after a short delay
      setTimeout(() => {
        navigate('/results/synopsis', {
          state: {
            analysis: analysisData,
            pdfArrayBuffer,
            pdfText,
          }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Error creating account:', err);
      setAuthError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Handle successful authentication (email signup only - Google OAuth is handled in Results component)
  useEffect(() => {
    if (user && !accountCreated && !isCreatingAccount && !location.state?.fromOAuth) {
      // This means email authentication was successful, now save the report
      const handleSuccessfulAuth = async () => {
        try {
          setIsCreatingAccount(true);
          await saveReportForUser();
          setAccountCreated(true);
          
          toast({
            title: "Account created successfully!",
            description: "Your inspection report has been saved to your account.",
          });
          
          // Navigate to results after a short delay
          setTimeout(() => {
            navigate('/results/synopsis', {
              state: {
                analysis: analysisData,
                pdfArrayBuffer,
                pdfText,
              }
            });
          }, 2000);
        } catch (err) {
          console.error('Error saving report after auth:', err);
          setAuthError(err instanceof Error ? err.message : "Failed to save report. Please try again.");
        } finally {
          setIsCreatingAccount(false);
        }
      };

      handleSuccessfulAuth();
    }
  }, [user, accountCreated, isCreatingAccount]);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accountCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900">Account Created!</h2>
              <p className="text-gray-600">Redirecting to your inspection report...</p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-500">Loading dashboard...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Free Account</CardTitle>
          <p className="text-gray-600 text-center">
            Save your inspection report and access it any time. Your account and the platform is entirely free to use. You can always delete your account and all your data.
          </p>
        </CardHeader>
        
        <CardContent>
          {(authError || error) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError || error}</AlertDescription>
            </Alert>
          )}

          {/* Primary Google Sign In Button */}
          <Button
            onClick={handleGoogleAuth}
            disabled={isCreatingAccount || isLoading}
            className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-medium mb-6"
          >
            <Chrome className="h-5 w-5" />
            Continue with Google (Recommended)
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-500 font-medium">Or use email</span>
            </div>
          </div>
          
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
              disabled={isCreatingAccount || isLoading}
            >
              {isCreatingAccount || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account with Email'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-600">Upload</span>
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
    </div>
  );
};

export default AccountCreation;
