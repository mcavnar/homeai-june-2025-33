
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HomeInspectionAnalysis } from '@/types/inspection';

interface ProcessingPhase {
  name: string;
  progress: number;
}

const PROCESSING_PHASES: ProcessingPhase[] = [
  { name: 'Uploading file...', progress: 10 },
  { name: 'Extracting text from PDF...', progress: 25 },
  { name: 'Analyzing inspection report...', progress: 50 },
  { name: 'Generating cost estimates...', progress: 75 },
  { name: 'Finalizing analysis...', progress: 95 }
];

export const useAnonymousPDFProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError('');
  }, []);

  const processPDF = async (): Promise<{ analysis: HomeInspectionAnalysis; pdfText: string; sessionId: string } | null> => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    console.log('Starting anonymous PDF processing for file:', file.name);
    setIsProcessing(true);
    setError('');
    setCurrentPhaseIndex(0);
    setOverallProgress(0);

    // Generate a unique session ID for anonymous users
    const sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated anonymous session ID:', sessionId);

    try {
      // Simulate processing phases
      for (let i = 0; i < PROCESSING_PHASES.length; i++) {
        setCurrentPhaseIndex(i);
        setOverallProgress(PROCESSING_PHASES[i].progress);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Prepare form data for the edge function
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('sessionId', sessionId);

      console.log('Calling process-pdf edge function...');
      const { data, error: processError } = await supabase.functions.invoke('process-pdf', {
        body: formData,
      });

      if (processError) {
        console.error('Process PDF error:', processError);
        throw new Error(processError.message || 'Failed to process PDF');
      }

      if (!data?.analysis) {
        console.error('No analysis data returned from edge function');
        throw new Error('No analysis data received');
      }

      console.log('Analysis completed successfully:', data.analysis);
      
      // Store the anonymous data in sessionStorage for later association
      const anonymousData = {
        analysis: data.analysis,
        pdfText: data.extractedText,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size
      };

      console.log('Storing anonymous data in sessionStorage:', anonymousData);
      sessionStorage.setItem('anonymousAnalysisData', JSON.stringify(anonymousData));
      sessionStorage.setItem('anonymousSessionId', sessionId);

      setOverallProgress(100);
      
      return {
        analysis: data.analysis,
        pdfText: data.extractedText,
        sessionId: sessionId
      };

    } catch (err) {
      console.error('Error processing PDF:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the PDF';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcessor = useCallback(() => {
    setFile(null);
    setIsProcessing(false);
    setCurrentPhaseIndex(0);
    setOverallProgress(0);
    setError('');
  }, []);

  const getPhaseMessage = useCallback(() => {
    if (!isProcessing) return '';
    return PROCESSING_PHASES[currentPhaseIndex]?.name || 'Processing...';
  }, [isProcessing, currentPhaseIndex]);

  const getEstimatedTimeRemaining = useCallback(() => {
    if (!isProcessing) return 0;
    const remainingPhases = PROCESSING_PHASES.length - currentPhaseIndex - 1;
    return remainingPhases * 2; // Estimate 2 seconds per remaining phase
  }, [isProcessing, currentPhaseIndex]);

  return {
    file,
    isProcessing,
    overallProgress,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
    getPhaseMessage,
    getEstimatedTimeRemaining,
  };
};
