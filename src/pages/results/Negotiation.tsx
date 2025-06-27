
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import NegotiationStrategy from '@/components/NegotiationStrategy';

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

  return (
    <div>
      <NegotiationStrategy
        negotiationStrategy={negotiationStrategy}
        isGeneratingStrategy={isGeneratingStrategy}
        strategyError={strategyError}
      />
    </div>
  );
};

export default Negotiation;
