
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

        const { data, error } = await supabase.functions.invoke('get-shared-report', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        if (error) {
          throw error;
        }

        setReportData(data);
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
