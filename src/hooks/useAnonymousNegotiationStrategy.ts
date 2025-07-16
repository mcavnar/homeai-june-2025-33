
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateNegotiationStrategy } from '@/utils/negotiationStrategyService';
import { HomeInspectionAnalysis, NegotiationStrategy } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { supabase } from '@/integrations/supabase/client';

export const useAnonymousNegotiationStrategy = (
  analysis: HomeInspectionAnalysis | null,
  propertyData: RedfinPropertyData | null,
  sessionId?: string
) => {
  const [negotiationStrategy, setNegotiationStrategy] = useState<NegotiationStrategy | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyError, setStrategyError] = useState<string>('');
  const [pendingStrategy, setPendingStrategy] = useState<NegotiationStrategy | null>(null);
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false);
  const { toast } = useToast();

  // Save pending strategy to anonymous report when it becomes available
  useEffect(() => {
    const savePendingStrategy = async () => {
      if (pendingStrategy && sessionId && !negotiationStrategy) {
        try {
          console.log('Saving pending negotiation strategy to anonymous report');
          const { error } = await supabase.from('anonymous_reports')
            .update({ negotiation_strategy: pendingStrategy as any })
            .eq('session_id', sessionId);
          
          if (error) {
            console.error('Error saving pending negotiation strategy:', error);
          }
          
          setNegotiationStrategy(pendingStrategy);
          setPendingStrategy(null);
          setIsGeneratingStrategy(false);
        } catch (error) {
          console.error('Error saving pending negotiation strategy:', error);
          // Don't fail the strategy generation if database save fails
          setNegotiationStrategy(pendingStrategy);
          setPendingStrategy(null);
          setIsGeneratingStrategy(false);
        }
      }
    };

    savePendingStrategy();
  }, [pendingStrategy, sessionId, negotiationStrategy]);

  useEffect(() => {
    const generateStrategy = async () => {
      // Don't generate if we already have a strategy, if generation is in progress, or if we loaded from database
      if (!analysis || !propertyData || negotiationStrategy || isGeneratingStrategy || hasLoadedFromDatabase) {
        console.log('Skipping negotiation strategy generation:', {
          hasAnalysis: !!analysis,
          hasPropertyData: !!propertyData,
          hasStrategy: !!negotiationStrategy,
          isGenerating: isGeneratingStrategy,
          hasLoadedFromDB: hasLoadedFromDatabase
        });
        return;
      }

      setIsGeneratingStrategy(true);
      setStrategyError('');

      try {
        console.log('Generating negotiation strategy with analysis and property data');
        
        toast({
          title: "Generating negotiation strategy...",
          description: "Analyzing inspection findings and market data to create your negotiation plan.",
        });

        const generatedStrategy = await generateNegotiationStrategy(analysis, propertyData);

        // If we have a session ID, try to save immediately
        if (sessionId) {
          try {
            console.log('Saving negotiation strategy to anonymous_reports table');
            const { error } = await supabase.from('anonymous_reports')
              .update({ negotiation_strategy: generatedStrategy as any })
              .eq('session_id', sessionId);
            
            if (error) {
              console.error('Error saving negotiation strategy to database:', error);
            }
            
            setNegotiationStrategy(generatedStrategy);
          } catch (error) {
            console.error('Error saving negotiation strategy to database:', error);
            // Don't fail the strategy generation if database save fails
            setNegotiationStrategy(generatedStrategy);
          }
        } else {
          // If no session ID yet, store as pending
          console.log('No session ID available yet, storing strategy as pending');
          setPendingStrategy(generatedStrategy);
        }

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

    generateStrategy();
  }, [analysis, propertyData, negotiationStrategy, isGeneratingStrategy, hasLoadedFromDatabase, sessionId, toast]);

  const resetStrategy = () => {
    setNegotiationStrategy(null);
    setPendingStrategy(null);
    setStrategyError('');
    setHasLoadedFromDatabase(false);
  };

  const setNegotiationStrategyFromDatabase = (strategy: NegotiationStrategy | null) => {
    console.log('Setting negotiation strategy from database:', !!strategy);
    setNegotiationStrategy(strategy);
    setPendingStrategy(null);
    setIsGeneratingStrategy(false);
    setHasLoadedFromDatabase(true);
    if (strategy) {
      console.log('Negotiation strategy loaded from database');
    }
  };

  return {
    negotiationStrategy: negotiationStrategy || pendingStrategy,
    isGeneratingStrategy,
    strategyError,
    resetStrategy,
    setNegotiationStrategyFromDatabase,
  };
};
