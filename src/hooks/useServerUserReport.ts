
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { NegotiationStrategy } from '@/types/inspection';

interface UserReport {
  id: string;
  analysis_data: HomeInspectionAnalysis;
  property_data?: RedfinPropertyData;
  negotiation_strategy?: NegotiationStrategy;
  pdf_file_path?: string;
  pdf_text?: string;
  pdf_metadata?: any;
  property_address?: string;
  inspection_date?: string;
  is_active: boolean;
  processing_status: string;
  created_at: string;
  updated_at: string;
}

export const useServerUserReport = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const saveUserReportViaServer = async (reportData: {
    analysis_data: HomeInspectionAnalysis;
    property_data?: RedfinPropertyData;
    negotiation_strategy?: NegotiationStrategy;
    pdf_file_path?: string;
    pdf_text?: string;
    pdf_metadata?: any;
    property_address?: string;
    inspection_date?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    setError('');

    try {
      console.log('Saving user report via edge function for user:', user.id);

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call the edge function with the session token
      const { data, error: functionError } = await supabase.functions.invoke('save-user-report', {
        body: reportData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw functionError;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to save report');
      }

      console.log('Successfully saved user report via edge function:', data.report.id);
      return data.report as UserReport;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user report';
      console.error('Error saving user report via server:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveUserReportViaServer,
    isLoading,
    error,
  };
};
