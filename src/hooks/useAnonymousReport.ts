
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { NegotiationStrategy } from '@/types/inspection';
import { getSessionId } from '@/utils/sessionUtils';

interface AnonymousReport {
  id: string;
  session_id: string;
  analysis_data: HomeInspectionAnalysis;
  property_data?: RedfinPropertyData;
  negotiation_strategy?: NegotiationStrategy;
  pdf_file_path?: string;
  pdf_text?: string;
  pdf_metadata?: any;
  property_address?: string;
  inspection_date?: string;
  created_at: string;
  expires_at: string;
}

export const useAnonymousReport = () => {
  const [anonymousReport, setAnonymousReport] = useState<AnonymousReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchAnonymousReport = async () => {
    try {
      setIsLoading(true);
      setError('');

      const sessionId = getSessionId();

      const { data, error: fetchError } = await supabase
        .from('anonymous_reports')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // Check if report is expired
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        
        if (now > expiresAt && !data.converted_to_user_id) {
          setError('Your report has expired. Please upload your inspection report again.');
          setAnonymousReport(null);
        } else {
          setAnonymousReport({
            id: data.id,
            session_id: data.session_id,
            analysis_data: data.analysis_data as HomeInspectionAnalysis,
            property_data: data.property_data ? (data.property_data as unknown as RedfinPropertyData) : undefined,
            negotiation_strategy: data.negotiation_strategy ? (data.negotiation_strategy as unknown as NegotiationStrategy) : undefined,
            pdf_file_path: data.pdf_file_path || undefined,
            pdf_text: data.pdf_text || undefined,
            pdf_metadata: data.pdf_metadata || undefined,
            property_address: data.property_address || undefined,
            inspection_date: data.inspection_date || undefined,
            created_at: data.created_at,
            expires_at: data.expires_at,
          });
        }
      } else {
        setAnonymousReport(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch anonymous report';
      setError(errorMessage);
      console.error('Error fetching anonymous report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnonymousReport();
  }, []);

  const updateAnonymousReport = async (updates: Partial<AnonymousReport>) => {
    if (!anonymousReport) return;

    try {
      const sessionId = getSessionId();
      
      const updateData: any = {};
      if (updates.property_data) updateData.property_data = updates.property_data;
      if (updates.negotiation_strategy) updateData.negotiation_strategy = updates.negotiation_strategy;

      const { data, error: updateError } = await supabase
        .from('anonymous_reports')
        .update(updateData)
        .eq('session_id', sessionId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setAnonymousReport({
          id: data.id,
          session_id: data.session_id,
          analysis_data: data.analysis_data as HomeInspectionAnalysis,
          property_data: data.property_data ? (data.property_data as unknown as RedfinPropertyData) : undefined,
          negotiation_strategy: data.negotiation_strategy ? (data.negotiation_strategy as unknown as NegotiationStrategy) : undefined,
          pdf_file_path: data.pdf_file_path || undefined,
          pdf_text: data.pdf_text || undefined,
          pdf_metadata: data.pdf_metadata || undefined,
          property_address: data.property_address || undefined,
          inspection_date: data.inspection_date || undefined,
          created_at: data.created_at,
          expires_at: data.expires_at,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update anonymous report';
      setError(errorMessage);
      console.error('Error updating anonymous report:', err);
    }
  };

  return {
    anonymousReport,
    isLoading,
    error,
    fetchAnonymousReport,
    updateAnonymousReport,
  };
};
