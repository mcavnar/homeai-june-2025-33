
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AtAGlance from '@/components/AtAGlance';
import ActionButtons from '@/components/ActionButtons';
import MostExpensiveIssues from '@/components/MostExpensiveIssues';
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
  const {
    analysis,
    propertyData,
    isLoadingProperty,
    propertyError,
  } = useOutletContext<SynopsisContextType>();

  const displayAddress = analysis.propertyInfo?.address 
    ? cleanAddressForDisplay(analysis.propertyInfo.address) 
    : undefined;

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

      {/* At a Glance Section */}
      {analysis && propertyData && (
        <AtAGlance analysis={analysis} propertyData={propertyData} />
      )}

      {/* Next Steps Action Buttons */}
      <ActionButtons />

      {/* Most Expensive Issues Section */}
      {analysis.issues && analysis.issues.length > 0 && (
        <MostExpensiveIssues issues={analysis.issues} />
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
  );
};

export default Synopsis;
