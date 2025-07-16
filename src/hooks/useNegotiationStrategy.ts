
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis, NegotiationStrategy } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { useUserReport } from '@/hooks/useUserReport';

export const useNegotiationStrategy = (
  analysis: HomeInspectionAnalysis | null,
  propertyData: RedfinPropertyData | null
) => {
  const [negotiationStrategy, setNegotiationStrategy] = useState<NegotiationStrategy | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyError, setStrategyError] = useState<string>('');
  const [pendingStrategy, setPendingStrategy] = useState<NegotiationStrategy | null>(null);
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false);
  const { toast } = useToast();
  const { userReport, updateUserReport } = useUserReport();

  // Save pending strategy to user report when it becomes available
  useEffect(() => {
    const savePendingStrategy = async () => {
      if (pendingStrategy && userReport && !negotiationStrategy) {
        try {
          console.log('Saving pending negotiation strategy to user report');
          await updateUserReport({ negotiation_strategy: pendingStrategy });
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
  }, [pendingStrategy, userReport, negotiationStrategy, updateUserReport]);

  useEffect(() => {
    const generateNegotiationStrategy = async () => {
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

        const generatedStrategy = data.negotiationStrategy;

        // If we have a user report, try to save immediately
        if (userReport) {
          try {
            console.log('Saving negotiation strategy to user_reports table');
            await updateUserReport({ negotiation_strategy: generatedStrategy });
            setNegotiationStrategy(generatedStrategy);
          } catch (error) {
            console.error('Error saving negotiation strategy to database:', error);
            // Don't fail the strategy generation if database save fails
            setNegotiationStrategy(generatedStrategy);
          }
        } else {
          // If no user report yet, store as pending
          console.log('No user report available yet, storing strategy as pending');
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

    generateNegotiationStrategy();
  }, [analysis, propertyData, negotiationStrategy, isGeneratingStrategy, hasLoadedFromDatabase, userReport, updateUserReport, toast]);

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
    setIsGeneratingStrategy(false); // Important: Reset loading state when loading from DB
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
