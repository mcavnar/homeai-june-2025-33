
import React from 'react';
import { useSharedReport } from '@/contexts/SharedReportContext';
import NegotiationStrategy from '@/components/NegotiationStrategy';

const SharedNegotiation = () => {
  const { analysis, propertyData, negotiationStrategy } = useSharedReport();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Negotiation Strategy</h1>
        <div className="text-gray-600 text-lg">
          <p>AI-powered negotiation insights and recommendations</p>
        </div>
      </div>

      <NegotiationStrategy
        analysis={analysis}
        propertyData={propertyData}
        negotiationStrategy={negotiationStrategy}
        isGenerating={false}
        error={null}
      />
    </div>
  );
};

export default SharedNegotiation;
