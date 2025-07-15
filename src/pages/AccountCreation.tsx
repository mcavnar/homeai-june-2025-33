
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServerUserReport } from '@/hooks/useServerUserReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const AccountCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { saveUserReportViaServer, isLoading, error } = useServerUserReport();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  // Get analysis data from location state
  const analysisData = location.state?.analysisData;
  const pdfArrayBuffer = location.state?.pdfArrayBuffer;
  const pdfText = location.state?.pdfText;

  useEffect(() => {
    if (!analysisData) {
      console.log('No analysis data found, redirecting to upload');
      navigate('/upload');
    }
  }, [analysisData, navigate]);

  const extractPropertyAddress = (analysisData: any): string | undefined => {
    // Try multiple ways to extract the property address
    if (analysisData.propertyInfo?.address) {
      return analysisData.propertyInfo.address;
    }
    
    if (analysisData.address) {
      return analysisData.address;
    }
    
    // Try to find address in the analysis data structure
    if (analysisData.property?.address) {
      return analysisData.property.address;
    }
    
    return undefined;
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

    if (!analysisData) {
      toast({
        title: "Missing data",
        description: "Analysis data not found. Please upload your report again.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAccount(true);
    
    try {
      console.log('Creating account for:', email);
      await signUp(email, password);
      
      // Wait a moment for the user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract property address from analysis data
      const propertyAddress = extractPropertyAddress(analysisData);
      console.log('Extracted property address:', propertyAddress);
      
      // Save the user report with proper property address
      const reportData = {
        analysis_data: analysisData,
        pdf_text: pdfText,
        property_address: propertyAddress,
        inspection_date: analysisData.propertyInfo?.inspectionDate,
      };
      
      console.log('Saving user report with data:', {
        hasAnalysisData: !!reportData.analysis_data,
        propertyAddress: reportData.property_address,
        inspectionDate: reportData.inspection_date,
      });
      
      await saveUserReportViaServer(reportData);
      
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
      toast({
        title: "Account creation failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

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
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
          <p className="text-gray-600 text-center">
            Save your inspection report and access it anytime
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isCreatingAccount || isLoading}
            >
              {isCreatingAccount || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Save Report'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountCreation;
