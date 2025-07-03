
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import NegotiationStrategy from '@/components/NegotiationStrategy';

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
    </div>
  );
};

export default DemoNegotiation;
