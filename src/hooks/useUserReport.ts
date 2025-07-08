import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';
import { NegotiationStrategy } from '@/types/inspection';
import { Database } from '@/integrations/supabase/types';

type UserReportRow = Database['public']['Tables']['user_reports']['Row'];
type UserReportInsert = Database['public']['Tables']['user_reports']['Insert'];
type UserReportUpdate = Database['public']['Tables']['user_reports']['Update'];

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

// Helper function to convert database row to UserReport
const convertRowToUserReport = (row: UserReportRow): UserReport => {
  return {
    id: row.id,
    analysis_data: row.analysis_data as unknown as HomeInspectionAnalysis,
    property_data: row.property_data ? (row.property_data as unknown as RedfinPropertyData) : undefined,
    negotiation_strategy: row.negotiation_strategy ? (row.negotiation_strategy as unknown as NegotiationStrategy) : undefined,
    pdf_file_path: row.pdf_file_path || undefined,
    pdf_text: row.pdf_text || undefined,
    pdf_metadata: row.pdf_metadata || undefined,
    property_address: row.property_address || undefined,
    inspection_date: row.inspection_date || undefined,
    is_active: row.is_active,
    processing_status: row.processing_status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

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

      setUserReport(data ? convertRowToUserReport(data) : null);
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
      console.log('Starting to save user report for user:', user.id);
      
      // First, mark any existing reports as inactive
      console.log('Deactivating existing active reports...');
      const { error: deactivateError } = await supabase
        .from('user_reports')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (deactivateError) {
        console.error('Error deactivating existing reports:', deactivateError);
        throw deactivateError;
      }

      // Create new active report
      console.log('Creating new active report...');
      const insertData: UserReportInsert = {
        user_id: user.id,
        analysis_data: reportData.analysis_data as any,
        property_data: reportData.property_data as any,
        negotiation_strategy: reportData.negotiation_strategy as any,
        pdf_file_path: reportData.pdf_file_path,
        pdf_text: reportData.pdf_text,
        pdf_metadata: reportData.pdf_metadata as any,
        property_address: reportData.property_address,
        inspection_date: reportData.inspection_date,
        is_active: true,
        processing_status: 'completed'
      };

      const { data, error: insertError } = await supabase
        .from('user_reports')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting new report:', insertError);
        throw insertError;
      }

      console.log('Successfully saved user report:', data.id);
      const convertedReport = convertRowToUserReport(data);
      setUserReport(convertedReport);
      return convertedReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user report';
      console.error('Critical error saving to user_reports:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUserReport = async (updates: Partial<UserReport>) => {
    if (!user || !userReport) throw new Error('No user report to update');

    try {
      const updateData: UserReportUpdate = {};
      
      if (updates.analysis_data) updateData.analysis_data = updates.analysis_data as any;
      if (updates.property_data) updateData.property_data = updates.property_data as any;
      if (updates.negotiation_strategy) updateData.negotiation_strategy = updates.negotiation_strategy as any;
      if (updates.pdf_file_path !== undefined) updateData.pdf_file_path = updates.pdf_file_path;
      if (updates.pdf_text !== undefined) updateData.pdf_text = updates.pdf_text;
      if (updates.pdf_metadata !== undefined) updateData.pdf_metadata = updates.pdf_metadata as any;
      if (updates.property_address !== undefined) updateData.property_address = updates.property_address;
      if (updates.inspection_date !== undefined) updateData.inspection_date = updates.inspection_date;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.processing_status !== undefined) updateData.processing_status = updates.processing_status;

      const { data, error: updateError } = await supabase
        .from('user_reports')
        .update(updateData)
        .eq('id', userReport.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const convertedReport = convertRowToUserReport(data);
      setUserReport(convertedReport);
      return convertedReport;
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
