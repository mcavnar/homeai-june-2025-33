import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserReport } from '@/hooks/useUserReport';
import { usePropertyDataManager } from '@/hooks/usePropertyDataManager';
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
  const { userReport, isLoading: isLoadingReport, error: reportError, saveUserReport, fetchUserReport } = useUserReport();
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

  // Extract property address early for parallel loading
  const extractPropertyAddressFromAnalysis = (analysisData: any): string | undefined => {
    if (!analysisData) return undefined;

    const addressFields = [
      analysisData?.propertyInfo?.address,
      analysisData?.address,
      analysisData?.property?.address,
      analysisData?.propertyDetails?.address,
      analysisData?.location?.address,
    ];

    for (const address of addressFields) {
      if (address && typeof address === 'string') {
        return address;
      }
    }
    return undefined;
  };

  // Get property address from userReport or analysis data
  const propertyAddress = userReport?.property_address || 
    extractPropertyAddressFromAnalysis(userReport?.analysis_data);

  // Use the new property data manager for parallel loading
  const { propertyData, isLoadingProperty, propertyError } = usePropertyDataManager({
    address: propertyAddress,
    propertyData: userReport?.property_data,
  });
  
  // Use PDF storage hook to download PDF if not available from location state
  const shouldDownloadPDF = !state?.pdfArrayBuffer && userReport?.pdf_file_path;
  
  console.log('PDF loading state:', {
    hasStateArrayBuffer: !!state?.pdfArrayBuffer,
    hasPDFFilePath: !!userReport?.pdf_file_path,
    shouldDownloadPDF,
    pdfFilePath: userReport?.pdf_file_path
  });

  const { 
    pdfArrayBuffer: storagePdfArrayBuffer, 
    isLoading: isDownloadingPDF, 
    error: pdfDownloadError 
  } = usePDFStorage(shouldDownloadPDF ? userReport.pdf_file_path : undefined);

  // Only start negotiation strategy generation when we have both analysis and property data
  // The userReport dependency is handled inside the hook now
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

        const propertyAddress = extractPropertyAddressFromAnalysis(parsedData.analysis) || parsedData.address;
        
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
        
        // Trigger a fresh fetch of the user report to get the latest data
        console.log('Triggering user report refetch after OAuth processing');
        await fetchUserReport();
        
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
  }, [hasOAuthDataPending, user, userReport, isProcessingOAuthData, saveUserReportViaServer, refreshExistingReportCheck, fetchUserReport, toast]);

  // Handle PDF loading from state or storage with better error handling
  useEffect(() => {
    console.log('PDF loading effect triggered:', {
      hasStateArrayBuffer: !!state?.pdfArrayBuffer,
      hasStorageArrayBuffer: !!storagePdfArrayBuffer,
      isDownloadingPDF,
      pdfDownloadError
    });

    // Priority: location state PDF > storage PDF
    if (state?.pdfArrayBuffer) {
      console.log('Using PDF from location state');
      setPdfArrayBuffer(state.pdfArrayBuffer);
    } else if (storagePdfArrayBuffer) {
      console.log('Using PDF from storage download');
      setPdfArrayBuffer(storagePdfArrayBuffer);
    } else if (pdfDownloadError) {
      console.error('PDF download failed:', pdfDownloadError);
      // Keep pdfArrayBuffer as null to trigger loading state
    }
  }, [state?.pdfArrayBuffer, storagePdfArrayBuffer, pdfDownloadError, isDownloadingPDF]);

  // Load negotiation strategy from database if it exists
  useEffect(() => {
    if (userReport?.negotiation_strategy) {
      console.log('Loading existing negotiation strategy from database');
      setNegotiationStrategyFromDatabase(userReport.negotiation_strategy as any);
    }
  }, [userReport?.negotiation_strategy, setNegotiationStrategyFromDatabase]);

  // Simplified loading logic - show loading only for critical blocking operations
  const isCriticalLoading = isProcessingOAuthData || isLoadingReport || isCheckingForReport || !hasInitializedOAuthCheck;

  if (isCriticalLoading) {
    console.log('=== SHOWING LOADING STATE ===');
    console.log('isProcessingOAuthData:', isProcessingOAuthData);
    console.log('isLoadingReport:', isLoadingReport);
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
             'Loading your report...'}
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
    isDownloadingPDF,
    pdfDownloadError,
    pdfFilePath: userReport?.pdf_file_path,
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
    isDownloadingPDF: contextValue.isDownloadingPDF,
    pdfDownloadError: contextValue.pdfDownloadError,
    pdfFilePath: contextValue.pdfFilePath,
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
