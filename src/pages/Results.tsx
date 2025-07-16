import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserReport } from '@/hooks/useUserReport';
import { usePropertyDataManager } from '@/hooks/usePropertyDataManager';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { usePDFStorage } from '@/hooks/usePDFStorage';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';
import { Loader2 } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasExistingReport, isCheckingForReport } = useAuth();
  const { userReport, isLoading: isLoadingReport, error: reportError } = useUserReport();
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  
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

  // Use the property data manager
  const { propertyData, isLoadingProperty, propertyError } = usePropertyDataManager({
    address: propertyAddress,
    propertyData: userReport?.property_data,
  });
  
  // Determine if we need to download PDF from storage
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

  // Use negotiation strategy hook
  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    setNegotiationStrategyFromDatabase,
  } = useNegotiationStrategy(userReport?.analysis_data || null, propertyData);

  // PDF loading logic
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

    // Priority: location state PDF > storage PDF > existing PDF
    if (state?.pdfArrayBuffer && !pdfArrayBuffer) {
      console.log('Setting PDF from location state');
      setPdfArrayBuffer(state.pdfArrayBuffer);
    } else if (storagePdfArrayBuffer && !pdfArrayBuffer) {
      console.log('Setting PDF from storage download');
      setPdfArrayBuffer(storagePdfArrayBuffer);
    } else if (pdfDownloadError) {
      console.error('PDF download failed:', pdfDownloadError);
      // Keep pdfArrayBuffer as null to trigger error state
    }
  }, [state?.pdfArrayBuffer, storagePdfArrayBuffer, pdfDownloadError, isDownloadingPDF, pdfArrayBuffer]);

  // Load negotiation strategy from database
  useEffect(() => {
    if (userReport?.negotiation_strategy) {
      console.log('Loading existing negotiation strategy from database');
      setNegotiationStrategyFromDatabase(userReport.negotiation_strategy as any);
    }
  }, [userReport?.negotiation_strategy, setNegotiationStrategyFromDatabase]);

  // Simplified loading logic - show loading only for critical blocking operations
  const isCriticalLoading = isLoadingReport || isCheckingForReport;

  if (isCriticalLoading) {
    console.log('=== SHOWING LOADING STATE ===');
    console.log('isLoadingReport:', isLoadingReport);
    console.log('isCheckingForReport:', isCheckingForReport);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">
            {isCheckingForReport ? 'Checking for existing reports...' : 'Loading your report...'}
          </p>
        </div>
      </div>
    );
  }

  if (!userReport && !reportError && hasExistingReport === false && !isCheckingForReport) {
    console.log('=== REDIRECTING TO UPLOAD ===');
    console.log('No user report found, no existing report, redirecting to upload');
    navigate('/upload');
    return null;
  }

  if (reportError && !isCheckingForReport) {
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
    strategyError: contextValue.strategyError,
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
