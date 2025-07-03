
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { HomeInspectionAnalysis } from '@/types/inspection';

export const usePDFProcessor = () => {
  const { user } = useAuth();
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
    if (!file || !user) {
      console.error('Missing file or user:', { file: !!file, user: !!user });
      return null;
    }

    setIsProcessing(true);
    setError('');
    setExtractionProgress(0);

    try {
      console.log('Starting PDF processing for user:', user.id);

      // Convert file to ArrayBuffer and store it
      const arrayBuffer = await file.arrayBuffer();
      setPdfArrayBuffer(arrayBuffer);

      // Upload PDF to Supabase storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('inspection-reports')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('PDF upload error:', uploadError);
        // Continue without PDF storage - not critical for analysis
      }

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

      console.log('Text extracted successfully, length:', extractionResult.text.length);

      // Send extracted text to Edge Function for analysis
      toast({
        title: "Analyzing with AI...",
        description: "Processing the content with OpenAI for detailed insights.",
      });

      const { data, error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { 
          extractedText: extractionResult.text,
          userEmail: user.email,
          userId: user.id,
          emailCaptureSource: 'authenticated-upload'
        },
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message);
      }

      if (!data.success) {
        console.error('Analysis failed:', data.error);
        throw new Error(data.error || 'Failed to analyze extracted text');
      }

      console.log('Analysis completed successfully');

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      setCleanedText(data.cleanedText || '');

      // First, mark any existing reports as inactive
      console.log('Marking existing reports as inactive for user:', user.id);
      const { error: deactivateError } = await supabase
        .from('user_reports')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (deactivateError) {
        console.error('Error deactivating existing reports:', deactivateError);
        // Continue - this is not critical
      }

      // Save to user_reports table - this is critical for the app to work
      console.log('Saving report to user_reports table');
      const { data: reportData, error: saveError } = await supabase.from('user_reports').insert({
        user_id: user.id,
        analysis_data: analysisData,
        property_address: analysisData.propertyInfo?.address,
        inspection_date: analysisData.propertyInfo?.inspectionDate,
        pdf_file_path: uploadError ? null : fileName,
        pdf_text: data.cleanedText,
        pdf_metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          pageCount: extractionResult.pageCount
        },
        is_active: true,
        processing_status: 'completed'
      }).select().single();

      if (saveError) {
        console.error('Critical error saving to user_reports:', saveError);
        throw new Error(`Failed to save report: ${saveError.message}`);
      }

      console.log('Report saved successfully to user_reports:', reportData?.id);

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
        userEmail: user.email
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF';
      console.error('PDF processing error:', err);
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
