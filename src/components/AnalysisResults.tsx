
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HomeInspectionAnalysis, NegotiationStrategy } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import PropertyInfo from './PropertyInfo';
import ConditionScore from './ConditionScore';
import CostSummary from './CostSummary';
import NegotiationStrategyComponent from './NegotiationStrategy';
import DetailedFindings from './DetailedFindings';
import MajorSystems from './MajorSystems';

interface AnalysisResultsProps {
  analysis: HomeInspectionAnalysis;
  propertyData?: RedfinPropertyData;
  negotiationStrategy?: NegotiationStrategy;
  isGeneratingStrategy: boolean;
  strategyError: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  propertyData,
  negotiationStrategy,
  isGeneratingStrategy,
  strategyError,
}) => {
  return (
    <div className="space-y-6">
      {/* Property Information */}
      {analysis.propertyInfo && (
        <PropertyInfo
          address={analysis.propertyInfo.address}
          inspectionDate={analysis.propertyInfo.inspectionDate}
        />
      )}

      {/* Condition Score Section - Only show when we have both analysis and property data */}
      {propertyData && (
        <ConditionScore analysis={analysis} propertyData={propertyData} />
      )}

      {/* Cost Summary */}
      {analysis.costSummary && (
        <CostSummary costSummary={analysis.costSummary} />
      )}

      {/* Negotiation Strategy */}
      {negotiationStrategy && (
        <NegotiationStrategyComponent strategy={negotiationStrategy} />
      )}

      {/* Negotiation Strategy Loading */}
      {isGeneratingStrategy && (
        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 py-4">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              <div className="text-center">
                <p className="font-medium text-gray-900">Generating negotiation strategy...</p>
                <p className="text-sm text-gray-600">Analyzing inspection and market data</p>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Detailed Issues */}
      {analysis.issues && analysis.issues.length > 0 && (
        <DetailedFindings issues={analysis.issues} />
      )}

      {/* Major Systems */}
      {analysis.majorSystems && (
        <MajorSystems systems={analysis.majorSystems} />
      )}
    </div>
  );
};

export default AnalysisResults;
