
import { useState, useEffect } from 'react';
import { pdfjsLib } from '@/utils/pdfConfig';

export const usePDFLoader = (pdfArrayBuffer: ArrayBuffer) => {
  const [pdf, setPdf] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfArrayBuffer || pdfArrayBuffer.byteLength === 0) {
        console.error('PDFViewer: Invalid or empty ArrayBuffer provided');
        setError('Invalid PDF data provided');
        setLoading(false);
        return;
      }

      try {
        console.log('PDFViewer: Loading PDF from ArrayBuffer, size:', pdfArrayBuffer.byteLength);
        setLoading(true);
        setError('');
        
        const loadedPdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        console.log('PDFViewer: PDF loaded successfully, pages:', loadedPdf.numPages);
      } catch (err) {
        console.error('PDFViewer: Error loading PDF:', err);
        setError('Failed to load PDF document');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfArrayBuffer]);

  return { pdf, totalPages, loading, error };
};
