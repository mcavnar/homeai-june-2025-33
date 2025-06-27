
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PropertyInfo from '@/components/PropertyInfo';
import ConditionScore from '@/components/ConditionScore';
import CostSummary from '@/components/CostSummary';
import MostExpensiveIssues from '@/components/MostExpensiveIssues';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {analysis.propertyInfo && (
            <PropertyInfo 
              address={analysis.propertyInfo.address}
              inspectionDate={analysis.propertyInfo.inspectionDate}
            />
          )}
          
          {analysis.costSummary && (
            <CostSummary costSummary={analysis.costSummary} />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {analysis && propertyData && (
            <ConditionScore analysis={analysis} propertyData={propertyData} />
          )}
        </div>
      </div>

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
