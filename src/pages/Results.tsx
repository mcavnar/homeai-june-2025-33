import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserReport } from '@/hooks/useUserReport';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { usePDFStorage } from '@/hooks/usePDFStorage';
import { useServerUserReport } from '@/hooks/useServerUserReport';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasExistingReport, isCheckingForReport, refreshExistingReportCheck } = useAuth();
  const { userReport, isLoading: isLoadingReport, error: reportError, saveUserReport } = useUserReport();
  const { saveUserReportViaServer } = useServerUserReport();
  const { toast } = useToast();
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [isProcessingOAuthData, setIsProcessingOAuthData] = useState(false);
  const [hasOAuthDataPending, setHasOAuthDataPending] = useState(false);
  const [hasInitializedOAuthCheck, setHasInitializedOAuthCheck] = useState(false);
  
  const state = location.state as { 
    analysis: any; 
    pdfArrayBuffer?: ArrayBuffer;
    pdfText?: string;
  } | null;
  
  // Use PDF storage hook to download PDF if not available from location state
  const shouldDownloadPDF = !state?.pdfArrayBuffer && userReport?.pdf_file_path;
  const { 
    pdfArrayBuffer: storagePdfArrayBuffer, 
    isLoading: isDownloadingPDF, 
    error: pdfDownloadError 
  } = usePDFStorage(shouldDownloadPDF ? userReport.pdf_file_path : undefined);

  const {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    setPropertyDataFromDatabase,
  } = usePropertyData();

  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    setNegotiationStrategyFromDatabase,
  } = useNegotiationStrategy(userReport?.analysis_data || null, propertyData);

  // Step 1: Initialize OAuth data check immediately when component loads
  useEffect(() => {
    console.log('=== RESULTS: INITIALIZING OAUTH CHECK ===');
    const storedData = sessionStorage.getItem('pendingAccountCreationData');
    
    if (storedData) {
      console.log('OAuth data detected in sessionStorage');
      try {
        const parsedData = JSON.parse(storedData);
        const isRecent = Date.now() - parsedData.timestamp < 600000; // 10 minutes
        
        if (isRecent) {
          console.log('OAuth data is recent, marking as pending');
          setHasOAuthDataPending(true);
        } else {
          console.log('OAuth data is too old, clearing it');
          sessionStorage.removeItem('pendingAccountCreationData');
        }
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        sessionStorage.removeItem('pendingAccountCreationData');
      }
    } else {
      console.log('No OAuth data found in sessionStorage');
    }
    
    setHasInitializedOAuthCheck(true);
  }, []);

  // Step 2: Process OAuth data when user is authenticated and OAuth data exists
  useEffect(() => {
    const processOAuthData = async () => {
      console.log('=== RESULTS: OAUTH DATA PROCESSING CHECK ===');
      console.log('HasOAuthDataPending:', hasOAuthDataPending);
      console.log('User authenticated:', !!user);
      console.log('UserReport exists:', !!userReport);
      console.log('IsProcessingOAuthData:', isProcessingOAuthData);

      // Only process if we have OAuth data, user is authenticated, no existing report, and not already processing
      if (!hasOAuthDataPending || !user || userReport || isProcessingOAuthData) {
        return;
      }

      const storedData = sessionStorage.getItem('pendingAccountCreationData');
      if (!storedData) {
        console.log('No stored OAuth data found during processing');
        setHasOAuthDataPending(false);
        return;
      }

      try {
        setIsProcessingOAuthData(true);
        const parsedData = JSON.parse(storedData);
        
        console.log('Processing OAuth data for authenticated user:', {
          hasAnalysis: !!parsedData.analysis,
          hasPropertyData: !!parsedData.propertyData,
          hasNegotiationStrategy: !!parsedData.negotiationStrategy,
          timestamp: parsedData.timestamp
        });

        // Extract property address
        const extractPropertyAddress = (analysisData: any): string | undefined => {
          if (!analysisData) return undefined;

          if (parsedData.address && typeof parsedData.address === 'string') {
            return parsedData.address;
          }

          const possibleAddresses = [
            analysisData?.propertyInfo?.address,
            analysisData?.address,
            analysisData?.property?.address,
            analysisData?.propertyDetails?.address,
            analysisData?.location?.address,
          ];

          for (const addr of possibleAddresses) {
            if (addr && typeof addr === 'string' && addr.trim().length > 0) {
              return addr;
            }
          }

          return undefined;
        };

        const propertyAddress = extractPropertyAddress(parsedData.analysis);
        
        // Save the report using the stored data
        const reportData = {
          analysis_data: parsedData.analysis,
          pdf_text: parsedData.pdfText,
          property_address: propertyAddress,
          inspection_date: parsedData.analysis?.propertyInfo?.inspectionDate || parsedData.analysis?.inspectionDate,
          property_data: parsedData.propertyData,
          negotiation_strategy: parsedData.negotiationStrategy,
        };

        console.log('Saving OAuth user report with data:', {
          hasAnalysisData: !!reportData.analysis_data,
          propertyAddress: reportData.property_address,
          hasPropertyData: !!reportData.property_data,
          hasNegotiationStrategy: !!reportData.negotiation_strategy,
        });
        
        await saveUserReportViaServer(reportData);
        
        // Clear stored data after successful save
        sessionStorage.removeItem('pendingAccountCreationData');
        setHasOAuthDataPending(false);
        
        // Refresh the existing report check in AuthContext
        await refreshExistingReportCheck();
        
        toast({
          title: "Account created successfully!",
          description: "Your inspection report has been saved to your account.",
        });

        console.log('OAuth data processing completed successfully');

      } catch (error) {
        console.error('Error processing OAuth data:', error);
        sessionStorage.removeItem('pendingAccountCreationData');
        setHasOAuthDataPending(false);
        
        // Refresh the existing report check to clear the temporary state
        await refreshExistingReportCheck();
        
        toast({
          title: "Error saving report",
          description: "There was an issue saving your report. Please try uploading again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessingOAuthData(false);
      }
    };

    processOAuthData();
  }, [hasOAuthDataPending, user, userReport, isProcessingOAuthData, saveUserReportViaServer, refreshExistingReportCheck, toast]);

  useEffect(() => {
    // Priority: location state PDF > storage PDF
    if (state?.pdfArrayBuffer) {
      setPdfArrayBuffer(state.pdfArrayBuffer);
    } else if (storagePdfArrayBuffer) {
      setPdfArrayBuffer(storagePdfArrayBuffer);
    }
  }, [state?.pdfArrayBuffer, storagePdfArrayBuffer]);

  const extractPropertyAddressFromAnalysis = (analysisData: any): string | undefined => {
    console.log('=== EXTRACTING ADDRESS FROM ANALYSIS DATA ===');
    console.log('Analysis data structure:', JSON.stringify(analysisData, null, 2));
    
    if (!analysisData) {
      console.log('No analysis data provided');
      return undefined;
    }

    // Try multiple possible locations for the address
    const addressFields = [
      analysisData?.propertyInfo?.address,
      analysisData?.address,
      analysisData?.property?.address,
      analysisData?.propertyDetails?.address,
      analysisData?.location?.address,
    ];

    for (const address of addressFields) {
      if (address && typeof address === 'string') {
        console.log('Found address:', address);
        return address;
      }
    }

    // Deep search for any address-like string
    const searchForAddress = (obj: any, path: string = ''): string | undefined => {
      if (typeof obj === 'string' && obj.includes(' ') && obj.includes(',')) {
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

    console.log('No address found in analysis data');
    return undefined;
  };

  useEffect(() => {
    if (!userReport) {
      console.log('UserReport not yet available, waiting...');
      return;
    }
    
    console.log('=== PROCESSING USER REPORT ===');
    console.log('User report data:', {
      hasPropertyData: !!userReport.property_data,
      hasNegotiationStrategy: !!userReport.negotiation_strategy,
      propertyAddress: userReport.property_address,
      userReportId: userReport.id,
      analysisDataKeys: Object.keys(userReport.analysis_data || {}),
    });

    // Load property data from database if it exists
    if (userReport.property_data) {
      console.log('Loading existing property data from database');
      setPropertyDataFromDatabase(userReport.property_data as any);
    } else {
      // Try to get property address from user report or extract from analysis data
      let propertyAddress = userReport.property_address;
      
      if (!propertyAddress && userReport.analysis_data) {
        console.log('No property_address in userReport, trying to extract from analysis_data');
        propertyAddress = extractPropertyAddressFromAnalysis(userReport.analysis_data);
      }
      
      console.log('Final property address to use:', propertyAddress);
      
      if (propertyAddress && !propertyData && !isLoadingProperty) {
        console.log('Fetching property details for address:', propertyAddress);
        // Add a small delay to ensure userReport state is fully settled
        setTimeout(() => {
          fetchPropertyDetails(propertyAddress);
        }, 100);
      } else if (!propertyAddress) {
        console.warn('WARNING: No property address available to fetch property data');
      }
    }

    // Load negotiation strategy from database if it exists
    if (userReport.negotiation_strategy) {
      console.log('Loading existing negotiation strategy from database');
      setNegotiationStrategyFromDatabase(userReport.negotiation_strategy as any);
    }
  }, [userReport, propertyData, isLoadingProperty, fetchPropertyDetails, setPropertyDataFromDatabase, setNegotiationStrategyFromDatabase]);

  if (isProcessingOAuthData || isLoadingReport || isDownloadingPDF || hasOAuthDataPending || isCheckingForReport || !hasInitializedOAuthCheck) {
    console.log('=== SHOWING LOADING STATE ===');
    console.log('isProcessingOAuthData:', isProcessingOAuthData);
    console.log('isLoadingReport:', isLoadingReport);
    console.log('isDownloadingPDF:', isDownloadingPDF);
    console.log('hasOAuthDataPending:', hasOAuthDataPending);
    console.log('isCheckingForReport:', isCheckingForReport);
    console.log('hasInitializedOAuthCheck:', hasInitializedOAuthCheck);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">
            {isProcessingOAuthData ? 'Setting up your account...' :
             hasOAuthDataPending ? 'Completing account setup...' :
             isCheckingForReport ? 'Checking for existing reports...' :
             isLoadingReport ? 'Loading your report...' : 
             'Loading PDF...'}
          </p>
        </div>
      </div>
    );
  }

  if (!userReport && !reportError && hasInitializedOAuthCheck && !hasOAuthDataPending && hasExistingReport === false && !isCheckingForReport) {
    console.log('=== REDIRECTING TO UPLOAD ===');
    console.log('No user report found, no OAuth data pending, no existing report, redirecting to upload');
    navigate('/upload');
    return null;
  }

  if (reportError && hasInitializedOAuthCheck && !hasOAuthDataPending && !isCheckingForReport) {
    console.error('Error loading user report:', reportError);
    navigate('/upload');
    return null;
  }

  if (pdfDownloadError) {
    console.error('Error downloading PDF:', pdfDownloadError);
  }

  const contextValue = {
    analysis: userReport?.analysis_data,
    propertyData,
    isLoadingProperty,
    propertyError,
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    pdfText: userReport?.pdf_text,
    pdfArrayBuffer: pdfArrayBuffer,
  };

  console.log('=== FINAL RESULTS CONTEXT ===');
  console.log('Context value:', {
    hasAnalysis: !!contextValue.analysis,
    hasPropertyData: !!contextValue.propertyData,
    isLoadingProperty: contextValue.isLoadingProperty,
    propertyError: contextValue.propertyError,
    hasNegotiationStrategy: !!contextValue.negotiationStrategy,
    isGeneratingStrategy: contextValue.isGeneratingStrategy,
    pdfArrayBuffer: contextValue.pdfArrayBuffer ? 'Available' : 'Not available',
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <ResultsSidebar />
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet context={contextValue} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Results;
