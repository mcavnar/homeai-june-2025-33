
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import NegotiationStrategy from '@/components/NegotiationStrategy';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { TrackedButton } from '@/components/TrackedButton';
import { useServiceOptIn } from '@/hooks/useServiceOptIn';
import ServiceOptInModal from '@/components/ServiceOptInModal';

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

  const {
    isModalOpen,
    openOptInModal,
    closeModal,
    confirmOptIn,
    currentService,
    getCurrentServiceConfig
  } = useServiceOptIn();

  const handleConciergeClick = () => {
    openOptInModal('concierge_negotiation');
  };

  const config = getCurrentServiceConfig();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Negotiation Strategy</h1>
        <div className="text-gray-600 text-lg">
          <p>AI-powered negotiation recommendations based on inspection findings</p>
        </div>
      </div>

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

      {strategyError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Negotiation strategy unavailable: {strategyError}
          </AlertDescription>
        </Alert>
      ) : negotiationStrategy ? (
        <NegotiationStrategy strategy={negotiationStrategy} />
      ) : !isGeneratingStrategy && (
        <div className="text-center py-12">
          <p className="text-gray-500">No negotiation strategy available yet.</p>
        </div>
      )}

      {/* Get Concierge Negotiation Help Section */}
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Get Concierge Negotiation Help
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Take the stress out of negotiations with our expert concierge service. Our experienced negotiation specialists will guide you through every step, help you craft compelling arguments, and ensure you maximize your leverage while maintaining positive relationships with all parties involved.
          </p>
          <TrackedButton 
            variant="default" 
            size="lg" 
            className="px-8"
            onClick={handleConciergeClick}
            trackingLabel="Get Concierge Negotiation Help"
          >
            Get Concierge Negotiation Help
          </TrackedButton>
        </CardContent>
      </Card>

      {config && currentService && (
        <ServiceOptInModal
          isOpen={isModalOpen}
          onClose={closeModal}
          serviceType={currentService}
          title={config.title}
          description={config.description}
          onConfirm={confirmOptIn}
        />
      )}
    </div>
  );
};

export default Negotiation;
