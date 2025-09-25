import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserReport } from '@/hooks/useUserReport';
import { usePropertyDataManager } from '@/hooks/usePropertyDataManager';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { usePDFStorage } from '@/hooks/usePDFStorage';
import { usePDFRecovery } from '@/hooks/usePDFRecovery';
import { useServerUserReport } from '@/hooks/useServerUserReport';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';
import { MultiReportNavigation, generateBreadcrumbs } from '@/components/MultiReportNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Upload, Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasExistingReport, isCheckingForReport, refreshExistingReportCheck } = useAuth();
  const { userReport, isLoading: isLoadingReport, error: reportError, saveUserReport, fetchUserReport, updateUserReport } = useUserReport();
  const { saveUserReportViaServer } = useServerUserReport();
  const { toast } = useToast();
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [isProcessingOAuthData, setIsProcessingOAuthData] = useState(false);
  const [hasOAuthDataPending, setHasOAuthDataPending] = useState(false);
  const [hasInitializedOAuthCheck, setHasInitializedOAuthCheck] = useState(false);

  // Mock data for multi-report UI demonstration
  const [selectedReportId, setSelectedReportId] = useState<string>('current');
  const [isLoadingReportSwitch, setIsLoadingReportSwitch] = useState(false);
  
  const mockReports = [
    {
      id: 'current',
      name: userReport ? `Inspection Report - ${new Date(userReport.created_at || Date.now()).toLocaleDateString()}` : 'Current Report',
      address: userReport?.property_address || 'Property Address',
      createdAt: new Date(userReport?.created_at || Date.now()),
      issueCounts: { high: 3, medium: 8, low: 12 },
      isPrimary: true,
      status: 'completed' as const
    },
    {
      id: 'demo-1',
      name: 'Oak Street Property - March 2024',
      address: '456 Oak Street, Springfield, IL 62701',
      createdAt: new Date('2024-03-10'),
      issueCounts: { high: 1, medium: 5, low: 7 },
      isPrimary: false,
      status: 'completed' as const
    },
    {
      id: 'demo-2', 
      name: 'Pine Ridge Condo Unit 2B',
      address: '789 Pine Ridge Drive, Unit 2B, Boulder, CO 80301',
      createdAt: new Date('2024-03-08'),
      issueCounts: { high: 0, medium: 3, low: 4 },
      isPrimary: false,
      status: 'processing' as const
    }
  ];

  // Only show current report if we have one, otherwise show all mock reports
  const availableReports = userReport ? [mockReports[0]] : mockReports;
  const currentReport = availableReports.find(r => r.id === selectedReportId) || availableReports[0];
  
  // Generate breadcrumbs based on current path and report
  const breadcrumbs = generateBreadcrumbs(location.pathname, currentReport?.name);
  
  // Handle report selection (mock behavior for now)
  const handleReportSelect = async (reportId: string) => {
    if (reportId === selectedReportId) return;
    
    setIsLoadingReportSwitch(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSelectedReportId(reportId);
    setIsLoadingReportSwitch(false);
    
    toast({
      title: "Report switched",
      description: `Now viewing: ${availableReports.find(r => r.id === reportId)?.name}`,
    });
  };

  const handleNewReport = () => {
    navigate('/upload');
  };

  const handleBackToHome = () => {
    navigate('/');
  };
  
  const state = location.state as { 
    analysis: any; 
    pdfArrayBuffer?: ArrayBuffer;
    pdfText?: string;
  } | null;

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

  const propertyAddress = userReport?.property_address || 
    extractPropertyAddressFromAnalysis(userReport?.analysis_data);

  const { propertyData, isLoadingProperty, propertyError } = usePropertyDataManager({
    address: propertyAddress,
    propertyData: userReport?.property_data,
  });
  
  const shouldDownloadPDF = Boolean(
    !state?.pdfArrayBuffer && 
    userReport?.pdf_file_path && 
    !pdfArrayBuffer
  );
  
  console.log('PDF loading decision:', {
    hasStateArrayBuffer: !!state?.pdfArrayBuffer,
    hasPDFFilePath: !!userReport?.pdf_file_path,
    hasExistingArrayBuffer: !!pdfArrayBuffer,
    shouldDownloadPDF,
    pdfFilePath: userReport?.pdf_file_path
  });

  const { 
    pdfArrayBuffer: storagePdfArrayBuffer, 
    isLoading: isDownloadingPDF, 
    error: pdfDownloadError 
  } = usePDFStorage(shouldDownloadPDF ? userReport.pdf_file_path : undefined);

  const { isRecovering: isRecoveringPDF, recoveryError } = usePDFRecovery(
    userReport,
    async (recoveredPDFData) => {
      try {
        console.log('PDF Recovery: Updating user report with recovered PDF data');
        await updateUserReport(recoveredPDFData);
        
        toast({
          title: "PDF recovered successfully!",
          description: "Your inspection report PDF has been restored.",
        });
      } catch (error) {
        console.error('PDF Recovery: Error updating user report:', error);
        toast({
          title: "PDF recovery failed",
          description: "Could not restore your PDF. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    }
  );

  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    setNegotiationStrategyFromDatabase,
  } = useNegotiationStrategy(userReport?.analysis_data || null, propertyData);

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

  useEffect(() => {
    const processOAuthData = async () => {
      console.log('=== RESULTS: OAUTH DATA PROCESSING CHECK ===');
      console.log('HasOAuthDataPending:', hasOAuthDataPending);
      console.log('User authenticated:', !!user);
      console.log('UserReport exists:', !!userReport);
      console.log('IsProcessingOAuthData:', isProcessingOAuthData);

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
        
        sessionStorage.removeItem('pendingAccountCreationData');
        setHasOAuthDataPending(false);
        
        await refreshExistingReportCheck();
        
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

  useEffect(() => {
    console.log('=== PDF LOADING EFFECT ===');
    console.log('PDF loading effect triggered:', {
      hasStateArrayBuffer: !!state?.pdfArrayBuffer,
      hasStorageArrayBuffer: !!storagePdfArrayBuffer,
      currentPdfArrayBuffer: !!pdfArrayBuffer,
      isDownloadingPDF,
      pdfDownloadError,
      shouldDownloadPDF
    });

    if (state?.pdfArrayBuffer && !pdfArrayBuffer) {
      console.log('Setting PDF from location state');
      setPdfArrayBuffer(state.pdfArrayBuffer);
    } else if (storagePdfArrayBuffer && !pdfArrayBuffer) {
      console.log('Setting PDF from storage download');
      setPdfArrayBuffer(storagePdfArrayBuffer);
    } else if (pdfDownloadError) {
      console.error('PDF download failed:', pdfDownloadError);
    }
  }, [state?.pdfArrayBuffer, storagePdfArrayBuffer, pdfDownloadError, isDownloadingPDF, pdfArrayBuffer]);

  useEffect(() => {
    if (userReport?.negotiation_strategy) {
      console.log('Loading existing negotiation strategy from database');
      setNegotiationStrategyFromDatabase(userReport.negotiation_strategy as any);
    }
  }, [userReport?.negotiation_strategy, setNegotiationStrategyFromDatabase]);

  const isCriticalLoading = isProcessingOAuthData || isLoadingReport || isCheckingForReport || !hasInitializedOAuthCheck;

  // Show loading state for report switching
  if (isLoadingReportSwitch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">Switching reports...</p>
        </div>
      </div>
    );
  }

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

  // Handle no report selected state (new multi-report functionality)
  if (!userReport && !reportError && hasInitializedOAuthCheck && !hasOAuthDataPending && hasExistingReport === false && !isCheckingForReport) {
    console.log('=== SHOWING NO REPORT SELECTED STATE ===');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <MultiReportNavigation
          reports={availableReports}
          selectedReportId={selectedReportId}
          onReportSelect={handleReportSelect}
          onNewReport={handleNewReport}
          breadcrumbs={breadcrumbs}
        />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <div className="max-w-md text-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">No Report Selected</h2>
              <p className="text-gray-600">
                Create your first inspection report to get started with detailed property analysis.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button onClick={handleNewReport} size="lg" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Inspection Report
              </Button>
              
              <Button onClick={handleBackToHome} variant="outline" size="lg" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
    isRecoveringPDF,
    pdfRecoveryError: recoveryError,
  };

  console.log('=== FINAL RESULTS CONTEXT ===');
  console.log('Context value:', {
    hasAnalysis: !!contextValue.analysis,
    hasPropertyData: !!contextValue.propertyData,
    isLoadingProperty: contextValue.isLoadingProperty,
    propertyError: contextValue.propertyError,
    hasNegotiationStrategy: !!contextValue.negotiationStrategy,
    isGeneratingStrategy: contextValue.isGeneratingStrategy,
    strategyError: contextValue.strategyError,
    pdfArrayBuffer: contextValue.pdfArrayBuffer ? 'Available' : 'Not available',
    isDownloadingPDF: contextValue.isDownloadingPDF,
    pdfDownloadError: contextValue.pdfDownloadError,
    pdfFilePath: contextValue.pdfFilePath,
    isRecoveringPDF: contextValue.isRecoveringPDF,
    pdfRecoveryError: contextValue.pdfRecoveryError,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Multi-Report Navigation Header */}
      <MultiReportNavigation
        reports={availableReports}
        selectedReportId={selectedReportId}
        onReportSelect={handleReportSelect}
        onNewReport={handleNewReport}
        breadcrumbs={breadcrumbs}
      />
      
      {/* Main Content Area with Sidebar */}
      <SidebarProvider>
        <div className="flex w-full">
          <ResultsSidebar />
          
          <main className="flex-1 flex flex-col">
            {/* Report Metadata Header */}
            {currentReport && (
              <div className="bg-white/50 backdrop-blur-sm border-b border-white/20 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          {currentReport.address}
                         {currentReport.isPrimary && (
                           <span className="text-yellow-500 text-sm">★ Primary</span>
                         )}
                       </h1>
                       <p className="text-sm text-gray-600 flex items-center gap-4">
                         <span>{currentReport.address}</span>
                         <span>•</span>
                         <span>Created {currentReport.createdAt.toLocaleDateString()}</span>
                         {currentReport.status === 'processing' && (
                           <>
                             <span>•</span>
                             <span className="text-yellow-600 flex items-center gap-1">
                               <Loader2 className="h-3 w-3 animate-spin" />
                               Processing
                             </span>
                           </>
                         )}
                       </p>
                     </div>
                    
                    <Button onClick={handleNewReport} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content Area */}
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet context={contextValue} />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Results;
