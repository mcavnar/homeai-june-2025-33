
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import NegotiationStrategy from '@/components/NegotiationStrategy';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface NegotiationContextType {
  negotiationStrategy: any;
  isGeneratingStrategy: boolean;
  strategyError: string;
}

const Negotiation = () => {
  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
  } = useOutletContext<NegotiationContextType>();

  if (isGeneratingStrategy) {
    return (
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
    );
  }

  if (strategyError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Negotiation strategy unavailable: {strategyError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!negotiationStrategy) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No negotiation strategy available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <NegotiationStrategy strategy={negotiationStrategy} />
    </div>
  );
};

export default Negotiation;
