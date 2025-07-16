
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
        console.log('No PDF file path provided');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Starting PDF download from storage:', pdfFilePath);
        console.log('Storage bucket: inspection-reports');
        
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          throw new Error('PDF download timed out after 30 seconds');
        }, 30000);

        const { data, error: downloadError } = await supabase.storage
          .from('inspection-reports')
          .download(pdfFilePath);

        clearTimeout(timeoutId);

        if (downloadError) {
          console.error('Supabase storage download error:', downloadError);
          throw new Error(`Storage download failed: ${downloadError.message}`);
        }

        if (!data) {
          throw new Error('No PDF data received from storage');
        }

        console.log('PDF data received from storage:', {
          size: data.size,
          type: data.type
        });

        const arrayBuffer = await data.arrayBuffer();
        
        if (arrayBuffer.byteLength === 0) {
          throw new Error('PDF file is empty');
        }

        setPdfArrayBuffer(arrayBuffer);
        console.log('PDF downloaded successfully:', {
          arrayBufferSize: arrayBuffer.byteLength,
          filePath: pdfFilePath
        });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to download PDF';
        console.error('Error downloading PDF from storage:', {
          error: err,
          filePath: pdfFilePath,
          message: errorMessage
        });
        setError(errorMessage);
        setPdfArrayBuffer(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Reset state when pdfFilePath changes
    if (pdfFilePath) {
      setPdfArrayBuffer(null);
      setError(null);
    }

    downloadPDF();
  }, [pdfFilePath]);

  return { pdfArrayBuffer, isLoading, error };
};
