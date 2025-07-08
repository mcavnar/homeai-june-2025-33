
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SharedReportContextType {
  analysis: any;
  propertyData: any;
  negotiationStrategy: any;
  pdfText: string;
  propertyAddress: string;
  inspectionDate: string;
  pdfPath: string;
  isLoading: boolean;
  error: string | null;
}

const SharedReportContext = createContext<SharedReportContextType | undefined>(undefined);

export const useSharedReport = () => {
  const context = useContext(SharedReportContext);
  if (context === undefined) {
    throw new Error('useSharedReport must be used within a SharedReportProvider');
  }
  return context;
};

interface SharedReportProviderProps {
  children: React.ReactNode;
  token: string;
}

export const SharedReportProvider: React.FC<SharedReportProviderProps> = ({ children, token }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedReport = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching shared report with token:', token);

        const { data, error: invokeError } = await supabase.functions.invoke('get-shared-report', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        console.log('Edge function response:', { data, invokeError });

        // Check for network/invoke errors first
        if (invokeError) {
          console.error('Network/invoke error:', invokeError);
          throw invokeError;
        }

        // Check for application-level errors in the data response
        if (data?.error) {
          console.error('Application error from edge function:', data.error);
          setError(data.error);
          return;
        }

        // If we get here, the response should be successful
        if (data) {
          console.log('Successfully fetched shared report data');
          setReportData(data);
        } else {
          console.error('No data received from edge function');
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching shared report:', err);
        setError('Failed to load shared report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedReport();
  }, [token]);

  const value: SharedReportContextType = {
    analysis: reportData?.analysis || null,
    propertyData: reportData?.propertyData || null,
    negotiationStrategy: reportData?.negotiationStrategy || null,
    pdfText: reportData?.pdfText || '',
    propertyAddress: reportData?.propertyAddress || '',
    inspectionDate: reportData?.inspectionDate || '',
    pdfPath: reportData?.pdfPath || '',
    isLoading,
    error,
  };

  return (
    <SharedReportContext.Provider value={value}>
      {children}
    </SharedReportContext.Provider>
  );
};
