
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useUserReport } from '@/hooks/useUserReport';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
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
    // If coming from upload flow with state, use that ArrayBuffer
    if (state?.pdfArrayBuffer) {
      setPdfArrayBuffer(state.pdfArrayBuffer);
    }
  }, [state]);

  useEffect(() => {
    if (!userReport) {
      console.log('UserReport not yet available, waiting...');
      return;
    }
    
    console.log('Loading data from user report:', {
      hasPropertyData: !!userReport.property_data,
      hasNegotiationStrategy: !!userReport.negotiation_strategy,
      propertyAddress: userReport.property_address,
      userReportId: userReport.id
    });

    // Load property data from database if it exists
    if (userReport.property_data) {
      console.log('Loading existing property data from database');
      setPropertyDataFromDatabase(userReport.property_data as any);
    } else if (userReport.property_address && !propertyData && !isLoadingProperty) {
      // Only fetch if we don't have property data in database and aren't already loading
      console.log('No property data in database, fetching from API for:', userReport.property_address);
      // Add a small delay to ensure userReport state is fully settled
      setTimeout(() => {
        fetchPropertyDetails(userReport.property_address!);
      }, 100);
    }

    // Load negotiation strategy from database if it exists
    if (userReport.negotiation_strategy) {
      console.log('Loading existing negotiation strategy from database');
      setNegotiationStrategyFromDatabase(userReport.negotiation_strategy as any);
    }
  }, [userReport, propertyData, isLoadingProperty, fetchPropertyDetails, setPropertyDataFromDatabase, setNegotiationStrategyFromDatabase]);

  // Show loading state while fetching user report
  if (isLoadingReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading your report...</p>
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

  console.log('Results context value pdfArrayBuffer:', contextValue.pdfArrayBuffer ? 'Available' : 'Not available');

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
