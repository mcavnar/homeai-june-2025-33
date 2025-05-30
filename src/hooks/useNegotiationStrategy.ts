
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis, NegotiationStrategy } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';

export const useNegotiationStrategy = (
  analysis: HomeInspectionAnalysis | null,
  propertyData: RedfinPropertyData | null
) => {
  const [negotiationStrategy, setNegotiationStrategy] = useState<NegotiationStrategy | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyError, setStrategyError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const generateNegotiationStrategy = async () => {
      if (!analysis || !propertyData || negotiationStrategy || isGeneratingStrategy) {
        return;
      }

      setIsGeneratingStrategy(true);
      setStrategyError('');

      try {
        toast({
          title: "Generating negotiation strategy...",
          description: "Analyzing inspection findings and market data to create your negotiation plan.",
        });

        const { data, error: functionError } = await supabase.functions.invoke('generate-negotiation-strategy', {
          body: { 
            inspectionAnalysis: analysis,
            propertyData: propertyData 
          },
        });

        if (functionError) {
          throw new Error(functionError.message);
        }

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate negotiation strategy');
        }

        setNegotiationStrategy(data.negotiationStrategy);

        toast({
          title: "Negotiation strategy ready!",
          description: "Your comprehensive negotiation plan has been generated based on inspection and market data.",
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate negotiation strategy';
        setStrategyError(errorMessage);
        console.error('Negotiation strategy error:', err);
        toast({
          title: "Strategy generation failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsGeneratingStrategy(false);
      }
    };

    generateNegotiationStrategy();
  }, [analysis, propertyData, negotiationStrategy, isGeneratingStrategy, toast]);

  const resetStrategy = () => {
    setNegotiationStrategy(null);
    setStrategyError('');
  };

  return {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    resetStrategy,
  };
};
