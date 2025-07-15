
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserReport } from '@/hooks/useUserReport';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { usePDFStorage } from '@/hooks/usePDFStorage';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';
import { Loader2 } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userReport, isLoading: isLoadingReport, error: reportError } = useUserReport();
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  
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

  useEffect(() => {
    // Priority: location state PDF > storage PDF
    if (state?.pdfArrayBuffer) {
      setPdfArrayBuffer(state.pdfArrayBuffer);
    } else if (storagePdfArrayBuffer) {
      setPdfArrayBuffer(storagePdfArrayBuffer);
    }
  }, [state?.pdfArrayBuffer, storagePdfArrayBuffer]);

  // Enhanced helper function to extract property address from analysis data
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

  // Show loading state while fetching user report or downloading PDF
  if (isLoadingReport || isDownloadingPDF) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">
            {isLoadingReport ? 'Loading your report...' : 'Loading PDF...'}
          </p>
        </div>
      </div>
    );
  }

  // If no report found, redirect to upload
  if (!userReport && !reportError) {
    console.log('No user report found, redirecting to upload');
    navigate('/upload');
    return null;
  }

  // If there's an error loading the report
  if (reportError) {
    console.error('Error loading user report:', reportError);
    navigate('/upload');
    return null;
  }

  // Log PDF download error but don't block the page
  if (pdfDownloadError) {
    console.error('Error downloading PDF:', pdfDownloadError);
  }

  const contextValue = {
    analysis: userReport.analysis_data,
    propertyData,
    isLoadingProperty,
    propertyError,
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    pdfText: userReport.pdf_text,
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
          {/* Content */}
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
