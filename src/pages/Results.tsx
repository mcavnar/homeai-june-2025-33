
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import AnalysisResults from '@/components/AnalysisResults';
import PropertyDetails from '@/components/PropertyDetails';
import ProcessingStatus from '@/components/ProcessingStatus';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';
import { HomeInspectionAnalysis } from '@/types/inspection';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as { analysis: HomeInspectionAnalysis; address?: string } | null;
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
            <p className="text-gray-600">Your home inspection report has been analyzed</p>
          </div>
          <Button onClick={handleStartOver} variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Analyze Another Report
          </Button>
        </div>

        {/* Analysis Results */}
        <AnalysisResults
          analysis={state.analysis}
          propertyData={propertyData}
          negotiationStrategy={negotiationStrategy}
          isGeneratingStrategy={isGeneratingStrategy}
          strategyError={strategyError}
        />

        {/* Property Details Section */}
        {propertyData && (
          <PropertyDetails propertyData={propertyData} />
        )}

        {/* Property Loading State */}
        {isLoadingProperty && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <div className="text-center">
                  <p className="font-medium text-gray-900">Fetching property details...</p>
                  <p className="text-sm text-gray-600">Looking up market information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Property Error */}
        {propertyError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Property details unavailable: {propertyError}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Results;
