
import { useState, useEffect } from 'react';
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

export const useUserReport = () => {
  const { user } = useAuth();
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchUserReport = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setUserReport(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user report';
      setError(errorMessage);
      console.error('Error fetching user report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserReport = async (reportData: {
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

    try {
      // First, mark any existing reports as inactive
      await supabase
        .from('user_reports')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Create new active report
      const { data, error: insertError } = await supabase
        .from('user_reports')
        .insert({
          user_id: user.id,
          analysis_data: reportData.analysis_data,
          property_data: reportData.property_data,
          negotiation_strategy: reportData.negotiation_strategy,
          pdf_file_path: reportData.pdf_file_path,
          pdf_text: reportData.pdf_text,
          pdf_metadata: reportData.pdf_metadata,
          property_address: reportData.property_address,
          inspection_date: reportData.inspection_date,
          is_active: true,
          processing_status: 'completed'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setUserReport(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user report';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUserReport = async (updates: Partial<UserReport>) => {
    if (!user || !userReport) throw new Error('No user report to update');

    try {
      const { data, error: updateError } = await supabase
        .from('user_reports')
        .update(updates)
        .eq('id', userReport.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setUserReport(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user report';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUserReport();
  }, [user]);

  return {
    userReport,
    isLoading,
    error,
    fetchUserReport,
    saveUserReport,
    updateUserReport,
  };
};
