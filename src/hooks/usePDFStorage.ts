
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsePDFStorageResult {
  pdfArrayBuffer: ArrayBuffer | null;
  isLoading: boolean;
  error: string | null;
}

export const usePDFStorage = (pdfFilePath?: string): UsePDFStorageResult => {
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const downloadPDF = async () => {
      if (!pdfFilePath) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Downloading PDF from storage:', pdfFilePath);
        
        const { data, error: downloadError } = await supabase.storage
          .from('inspection-reports')
          .download(pdfFilePath);

        if (downloadError) {
          throw downloadError;
        }

        if (!data) {
          throw new Error('No PDF data received');
        }

        const arrayBuffer = await data.arrayBuffer();
        setPdfArrayBuffer(arrayBuffer);
        console.log('PDF downloaded successfully, size:', arrayBuffer.byteLength);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to download PDF';
        console.error('Error downloading PDF from storage:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    downloadPDF();
  }, [pdfFilePath]);

  return { pdfArrayBuffer, isLoading, error };
};
