
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<{ 
    analysis: HomeInspectionAnalysis; 
    address?: string; 
    pdfText?: string;
    pdfArrayBuffer?: ArrayBuffer;
  } | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const state = location.state as { 
    analysis: HomeInspectionAnalysis; 
    address?: string; 
    pdfText?: string;
    pdfArrayBuffer?: ArrayBuffer;
  } | null;
  
  const {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
  } = usePropertyData();

  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
  } = useNegotiationStrategy(analysisData?.analysis || null, propertyData);

  useEffect(() => {
    // Only run initialization once
    if (hasInitialized) return;

    console.log('Results component mounted');
    console.log('Location state:', state);
    
    let dataToUse = state;
    
    // If no state from navigation, try sessionStorage
    if (!dataToUse) {
      console.log('No state from navigation, checking sessionStorage');
      const storedData = sessionStorage.getItem('analysisData');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          dataToUse = parsed;
          console.log('Found data in sessionStorage:', dataToUse);
        } catch (e) {
          console.error('Error parsing sessionStorage data:', e);
        }
      }
    }

    if (!dataToUse?.analysis) {
      console.log('No analysis data found, redirecting to upload');
      navigate('/');
      return;
    }

    console.log('Setting analysis data:', dataToUse);
    console.log('pdfArrayBuffer in analysisData:', dataToUse.pdfArrayBuffer ? 'Available' : 'Not available');
    setAnalysisData(dataToUse);
    setHasInitialized(true);

    // Fetch property data if address is available
    if (dataToUse.address) {
      console.log('Fetching property details for:', dataToUse.address);
      fetchPropertyDetails(dataToUse.address);
    }
  }, [navigate, fetchPropertyDetails, hasInitialized, state]);

  // If no analysis data, don't render anything (will redirect)
  if (!analysisData?.analysis) {
    console.log('No analysis data, not rendering');
    return null;
  }

  const contextValue = {
    analysis: analysisData.analysis,
    propertyData,
    isLoadingProperty,
    propertyError,
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    pdfText: analysisData.pdfText,
    pdfArrayBuffer: analysisData.pdfArrayBuffer,
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
