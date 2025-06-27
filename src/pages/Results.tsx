
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as { analysis: HomeInspectionAnalysis; address?: string; pdfText?: string } | null;
  
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
  } = useNegotiationStrategy(state?.analysis || null, propertyData);

  useEffect(() => {
    // If no analysis data, redirect to upload page
    if (!state?.analysis) {
      navigate('/');
      return;
    }

    // Fetch property data if address is available
    if (state.address) {
      fetchPropertyDetails(state.address);
    }
  }, [state, navigate, fetchPropertyDetails]);

  const handleStartOver = () => {
    navigate('/');
  };

  // If no analysis data, don't render anything (will redirect)
  if (!state?.analysis) {
    return null;
  }

  const contextValue = {
    analysis: state.analysis,
    propertyData,
    isLoadingProperty,
    propertyError,
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    pdfText: state.pdfText,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <ResultsSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                <p className="text-gray-600">Your home inspection report has been analyzed</p>
              </div>
              <Button onClick={handleStartOver} variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Analyze Another Report
              </Button>
            </div>
          </div>

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
