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
  const { user } = useAuth();
  const { userReport, isLoading: isLoadingReport, error: reportError, saveUserReport } = useUserReport();
  const { saveUserReportViaServer } = useServerUserReport();
  const { toast } = useToast();
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [isProcessingOAuthData, setIsProcessingOAuthData] = useState(false);
  
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

  // Handle sessionStorage data from OAuth flow
  useEffect(() => {
    const handleOAuthData = async () => {
      if (!user || userReport || isProcessingOAuthData) return;

      // Check for stored data from OAuth flow
      const storedData = sessionStorage.getItem('pendingAccountCreationData');
      if (!storedData) return;

      try {
        setIsProcessingOAuthData(true);
        const parsedData = JSON.parse(storedData);
        
        console.log('Found stored OAuth data:', parsedData);
        
        // Check if data is recent (within 10 minutes)
        const isRecent = Date.now() - parsedData.timestamp < 600000;
        if (!isRecent) {
          console.log('Stored data is too old, clearing it');
          sessionStorage.removeItem('pendingAccountCreationData');
          return;
        }

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

        console.log('Saving OAuth user report with data:', reportData);
        await saveUserReportViaServer(reportData);
        
        // Clear stored data after successful save
        sessionStorage.removeItem('pendingAccountCreationData');
        
        toast({
          title: "Account created successfully!",
          description: "Your inspection report has been saved to your account.",
        });

        // Force a refresh of the user report
        window.location.reload();

      } catch (error) {
        console.error('Error processing OAuth data:', error);
        sessionStorage.removeItem('pendingAccountCreationData');
        toast({
          title: "Error saving report",
          description: "There was an issue saving your report. Please try uploading again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessingOAuthData(false);
      }
    };

    handleOAuthData();
  }, [user, userReport, isProcessingOAuthData, saveUserReportViaServer, toast]);

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

  // Show loading state while fetching user report, downloading PDF, or processing OAuth data
  if (isLoadingReport || isDownloadingPDF || isProcessingOAuthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">
            {isLoadingReport ? 'Loading your report...' : 
             isDownloadingPDF ? 'Loading PDF...' : 
             'Setting up your account...'}
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
