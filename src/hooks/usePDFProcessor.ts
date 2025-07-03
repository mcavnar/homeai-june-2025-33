
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { HomeInspectionAnalysis } from '@/types/inspection';

export const usePDFProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [analysis, setAnalysis] = useState<HomeInspectionAnalysis | null>(null);
  const [cleanedText, setCleanedText] = useState<string>('');
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    // Reset previous state
    setAnalysis(null);
    setPdfArrayBuffer(null);
    setError('');

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    toast({
      title: "File selected",
      description: `${selectedFile.name} is ready for processing.`,
    });
  };

  const processPDF = async () => {
    if (!file) return null;

    setIsProcessing(true);
    setError('');
    setExtractionProgress(0);

    try {
      // Convert file to ArrayBuffer and store it
      const arrayBuffer = await file.arrayBuffer();
      setPdfArrayBuffer(arrayBuffer);

      // Extract text from PDF in the frontend
      toast({
        title: "Extracting text from PDF...",
        description: "Processing your document, please wait.",
      });

      const extractionResult = await extractTextFromPDF(file, (progress) => {
        setExtractionProgress(progress);
      });

      if (extractionResult.error) {
        throw new Error(extractionResult.error);
      }

      if (!extractionResult.text || extractionResult.text.length < 50) {
        throw new Error('Unable to extract sufficient text from PDF. The document may be image-based or corrupted.');
      }

      // Send extracted text to Edge Function for analysis
      toast({
        title: "Analyzing with AI...",
        description: "Processing the content with OpenAI for detailed insights.",
      });

      const { data, error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { 
          extractedText: extractionResult.text,
          userEmail: sessionStorage.getItem('userEmail') || '',
          emailCaptureSource: sessionStorage.getItem('emailCaptureSource') || 'upload-page'
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze extracted text');
      }

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      setCleanedText(data.cleanedText || '');

      toast({
        title: "Analysis complete!",
        description: `Processed ${extractionResult.pageCount} pages and generated comprehensive insights.`,
      });

      // Return the structured data with all necessary components
      return {
        analysis: analysisData,
        pdfArrayBuffer: arrayBuffer,
        pdfText: data.cleanedText || '',
        address: analysisData.propertyInfo?.address,
        userEmail: sessionStorage.getItem('userEmail') || ''
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF';
      setError(errorMessage);
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
      setExtractionProgress(0);
    }
  };

  const resetProcessor = () => {
    setFile(null);
    setAnalysis(null);
    setCleanedText('');
    setPdfArrayBuffer(null);
    setError('');
  };

  return {
    file,
    isProcessing,
    extractionProgress,
    analysis,
    cleanedText,
    pdfArrayBuffer,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
  };
};
