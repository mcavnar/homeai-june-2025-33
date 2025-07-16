
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnonymousReport } from '@/hooks/useAnonymousReport';
import { useAnonymousPropertyData } from '@/hooks/useAnonymousPropertyData';
import { useAnonymousNegotiationStrategy } from '@/hooks/useAnonymousNegotiationStrategy';
import AtAGlance from '@/components/AtAGlance';
import ModernStepper from '@/components/ModernStepper';
import MostExpensiveIssues from '@/components/MostExpensiveIssues';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cleanAddressForDisplay } from '@/utils/addressUtils';

const AnonymousSynopsis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { anonymousReport, isLoading, error } = useAnonymousReport();
  
  // Get data from navigation state if available (for immediate display)
  const stateData = location.state;
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Use state data first, then fallback to database data
  const reportData = stateData || anonymousReport;
  const analysis = reportData?.analysis;

  // Get session ID from state or report
  useEffect(() => {
    const currentSessionId = stateData?.sessionId || anonymousReport?.session_id;
    setSessionId(currentSessionId);
  }, [stateData, anonymousReport]);

  // Initialize property data hooks
  const {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    setPropertyDataFromDatabase,
  } = useAnonymousPropertyData(sessionId || undefined);

  // Initialize negotiation strategy hooks
  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    setNegotiationStrategyFromDatabase,
  } = useAnonymousNegotiationStrategy(analysis, propertyData, sessionId || undefined);

  // Load property data from database if available
  useEffect(() => {
    if (reportData?.property_data && !propertyData) {
      setPropertyDataFromDatabase(reportData.property_data);
    }
  }, [reportData?.property_data, propertyData, setPropertyDataFromDatabase]);

  // Load negotiation strategy from database if available
  useEffect(() => {
    if (reportData?.negotiation_strategy && !negotiationStrategy) {
      setNegotiationStrategyFromDatabase(reportData.negotiation_strategy);
    }
  }, [reportData?.negotiation_strategy, negotiationStrategy, setNegotiationStrategyFromDatabase]);

  // Fetch property data when analysis is available and address is present
  useEffect(() => {
    const address = analysis?.propertyInfo?.address;
    if (address && !propertyData && !isLoadingProperty && !propertyError && sessionId) {
      console.log('Fetching property data for address:', address);
      fetchPropertyDetails(address);
    }
  }, [analysis, propertyData, isLoadingProperty, propertyError, sessionId, fetchPropertyDetails]);

  // Redirect to upload if no data
  if (!isLoading && !reportData && !stateData) {
    navigate('/anonymous-upload');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Not Found</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => navigate('/anonymous-upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload New Report
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Preparing your analysis...</p>
        </div>
      </div>
    );
  }

  const displayAddress = analysis.propertyInfo?.address 
    ? cleanAddressForDisplay(analysis.propertyInfo.address) 
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <div className="text-gray-600 text-lg">
              {displayAddress && analysis.propertyInfo?.inspectionDate ? (
                <p>{displayAddress} • Inspection Date: {analysis.propertyInfo.inspectionDate}</p>
              ) : displayAddress ? (
                <p>{displayAddress}</p>
              ) : analysis.propertyInfo?.inspectionDate ? (
                <p>Inspection Date: {analysis.propertyInfo.inspectionDate}</p>
              ) : null}
            </div>
          </div>

          {/* Property Loading State - Only show if actively loading */}
          {isLoadingProperty && (
            <Alert className="bg-blue-50 border-blue-200">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Loading property details...</strong> Market information is being fetched to calculate your condition score.
              </AlertDescription>
            </Alert>
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

          {/* Negotiation Strategy Loading */}
          {isGeneratingStrategy && (
            <Alert className="bg-purple-50 border-purple-200">
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Generating negotiation strategy...</strong> Analyzing inspection findings and market data.
              </AlertDescription>
            </Alert>
          )}

          {/* Negotiation Strategy Error */}
          {strategyError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Negotiation strategy unavailable: {strategyError}
              </AlertDescription>
            </Alert>
          )}

          {/* At a Glance Section - Show immediately with available data */}
          <AtAGlance 
            analysis={analysis} 
            propertyData={propertyData}
            negotiationStrategy={negotiationStrategy}
          />

          {/* Modern Stepper Next Steps */}
          <ModernStepper />

          {/* Most Expensive Issues Section */}
          {analysis.issues && analysis.issues.length > 0 && (
            <MostExpensiveIssues issues={analysis.issues} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnonymousSynopsis;
