
import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DollarSign, MessageSquare } from 'lucide-react';
import AtAGlance from '@/components/AtAGlance';
import MostExpensiveIssues from '@/components/MostExpensiveIssues';
import ContextualCTA from '@/components/ContextualCTA';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cleanAddressForDisplay } from '@/utils/addressUtils';

interface SynopsisContextType {
  analysis: any;
  propertyData: any;
  isLoadingProperty: boolean;
  propertyError: string;
}

const Synopsis = () => {
  const navigate = useNavigate();
  const {
    analysis,
    propertyData,
    isLoadingProperty,
    propertyError,
  } = useOutletContext<SynopsisContextType>();

  const displayAddress = analysis.propertyInfo?.address 
    ? cleanAddressForDisplay(analysis.propertyInfo.address) 
    : undefined;

  const handleServiceProviders = () => {
    navigate('/results/providers');
  };

  const handleNegotiation = () => {
    navigate('/results/negotiation');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Synopsis</h1>
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

      {/* At a Glance Section with integrated CTA */}
      {analysis && propertyData && (
        <AtAGlance analysis={analysis} propertyData={propertyData} />
      )}

      {/* Most Expensive Issues Section with integrated CTA */}
      {analysis.issues && analysis.issues.length > 0 && (
        <MostExpensiveIssues issues={analysis.issues} />
      )}

      {/* Service Providers CTA */}
      <ContextualCTA
        text="Need help addressing these issues? Find qualified contractors and understand ongoing costs."
        buttonText="Explore Service Providers"
        onClick={handleServiceProviders}
        icon={DollarSign}
        variant="subtle"
      />

      {/* Negotiation Strategy CTA */}
      <ContextualCTA
        text="Ready to use these findings in your purchase negotiations?"
        buttonText="Get Negotiation Strategy"
        onClick={handleNegotiation}
        icon={MessageSquare}
        variant="prominent"
      />

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
  );
};

export default Synopsis;
