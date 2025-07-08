
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import NegotiationStrategy from '@/components/NegotiationStrategy';
import { Card, CardContent } from '@/components/ui/card';
import { TrackedButton } from '@/components/TrackedButton';

interface DemoNegotiationContextType {
  negotiationStrategy: any;
}

const DemoNegotiation = () => {
  const { negotiationStrategy } = useOutletContext<DemoNegotiationContextType>();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Negotiation Strategy</h1>
        <div className="text-gray-600 text-lg">
          <p>AI-powered negotiation recommendations based on inspection findings</p>
        </div>
      </div>

      <NegotiationStrategy strategy={negotiationStrategy} />

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
            trackingLabel="Get Concierge Negotiation Help"
          >
            Get Concierge Negotiation Help
          </TrackedButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoNegotiation;
