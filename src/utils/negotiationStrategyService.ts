
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis } from '@/types/inspection';

export const generateNegotiationStrategy = async (
  analysisData: HomeInspectionAnalysis, 
  propertyData: any,
  userEmail: string | null = null
) => {
  try {
    console.log('Generating negotiation strategy...');
    
    const { data, error } = await supabase.functions.invoke('generate-negotiation-strategy', {
      body: {
        analysis: analysisData,
        propertyData: propertyData,
        userEmail: userEmail,
        emailCaptureSource: 'anonymous-upload'
      }
    });

    if (error) {
      console.error('Negotiation strategy generation error:', error);
      return null;
    }

    if (data && data.success) {
      console.log('Negotiation strategy generated successfully');
      return data.strategy;
    } else {
      console.log('Negotiation strategy generation failed');
      return null;
    }
  } catch (err) {
    console.error('Error generating negotiation strategy:', err);
    return null;
  }
};
