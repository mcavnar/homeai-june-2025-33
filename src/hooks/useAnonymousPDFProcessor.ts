import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { HomeInspectionAnalysis } from '@/types/inspection';

type ProcessingPhase = 'extraction' | 'analysis' | 'saving' | 'complete';

export const useAnonymousPDFProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<ProcessingPhase>('extraction');
  const [analysis, setAnalysis] = useState<HomeInspectionAnalysis | null>(null);
  const [cleanedText, setCleanedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Generate a temporary session ID for anonymous users
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('anonymousSessionId');
    if (!sessionId) {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('anonymousSessionId', sessionId);
    }
    return sessionId;
  };

  const handleFileSelect = (selectedFile: File) => {
    // Reset previous state
    setAnalysis(null);
    setError('');
    setOverallProgress(0);
    setCurrentPhase('extraction');

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

  const simulateAIProgress = (textLength: number): Promise<void> => {
    return new Promise((resolve) => {
      const baseTime = 35;
      const timeMultiplier = Math.min(Math.max(textLength / 5000, 0.8), 2.5);
      const estimatedTime = baseTime * timeMultiplier * 1000;
      
      const startProgress = 25;
      const endProgress = 85;
      const totalProgressRange = endProgress - startProgress;
      
      const startTime = Date.now();
      const interval = 200;
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / estimatedTime, 1);
        
        const easedProgress = 1 - Math.pow(1 - progressRatio, 2);
        const currentProgress = startProgress + (totalProgressRange * easedProgress);
        
        setOverallProgress(Math.min(currentProgress, endProgress));
        
        if (progressRatio >= 1) {
          clearInterval(progressInterval);
          resolve();
        }
      }, interval);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setOverallProgress(endProgress);
        resolve();
      }, 150000);
    });
  };

  const processPDF = async () => {
    if (!file) {
      console.error('No file selected');
      return null;
    }

    setIsProcessing(true);
    setError('');
    setExtractionProgress(0);
    setOverallProgress(0);
    setCurrentPhase('extraction');

    try {
      const sessionId = getSessionId();
      console.log('Starting anonymous PDF processing with session:', sessionId);

      // Extract text from PDF
      toast({
        title: "Extracting text from PDF...",
        description: "Processing your document, please wait.",
      });

      const extractionResult = await extractTextFromPDF(file, (progress) => {
        setExtractionProgress(progress);
        setOverallProgress((progress / 100) * 25);
      });

      if (extractionResult.error) {
        throw new Error(extractionResult.error);
      }

      if (!extractionResult.text || extractionResult.text.length < 50) {
        throw new Error('Unable to extract sufficient text from PDF. The document may be image-based or corrupted.');
      }

      console.log('Text extracted successfully, length:', extractionResult.text.length);

      // Transition to AI analysis phase
      setCurrentPhase('analysis');
      setOverallProgress(25);

      toast({
        title: "Analyzing with AI...",
        description: "Processing the content with OpenAI for detailed insights.",
      });

      // Start simulated progress for AI analysis
      const aiProgressPromise = simulateAIProgress(extractionResult.text.length);

      // Send extracted text to Edge Function for analysis (without user context)
      const { data, error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { 
          extractedText: extractionResult.text,
          userEmail: null, // Anonymous user
          userId: null,    // Anonymous user
          sessionId: sessionId,
          emailCaptureSource: 'anonymous-upload'
        },
      });

      await aiProgressPromise;

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message);
      }

      if (!data.success) {
        console.error('Analysis failed:', data.error);
        throw new Error(data.error || 'Failed to analyze extracted text');
      }

      console.log('Analysis completed successfully');

      // Complete the process
      setCurrentPhase('complete');
      setOverallProgress(100);

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      setCleanedText(data.cleanedText || '');

      toast({
        title: "Analysis complete!",
        description: `Processed ${extractionResult.pageCount} pages and generated comprehensive insights.`,
      });

      // Store analysis data for anonymous users with consistent key name
      const sessionData = {
        analysis: analysisData,
        pdfText: data.cleanedText || '',
        address: analysisData.propertyInfo?.address,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      };
      
      console.log('Storing anonymous analysis data:', sessionData);
      sessionStorage.setItem('anonymousAnalysisData', JSON.stringify(sessionData));

      // Return the structured data
      return {
        analysis: analysisData,
        pdfText: data.cleanedText || '',
        address: analysisData.propertyInfo?.address,
        sessionId: sessionId
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
      setOverallProgress(0);
      setCurrentPhase('extraction');
    }
  };

  const resetProcessor = () => {
    setFile(null);
    setAnalysis(null);
    setCleanedText('');
    setError('');
    setOverallProgress(0);
    setCurrentPhase('extraction');
  };

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case 'extraction':
        return 'Extracting text from PDF...';
      case 'analysis':
        return 'Analyzing with AI for insights and costs...';
      case 'saving':
        return 'Preparing your results...';
      case 'complete':
        return 'Analysis complete!';
      default:
        return 'Processing...';
    }
  };

  const getEstimatedTimeRemaining = () => {
    if (!isProcessing) return null;
    
    switch (currentPhase) {
      case 'extraction':
        return '10 seconds remaining';
      case 'analysis':
        const analysisProgress = (overallProgress - 25) / 60;
        const remainingSeconds = Math.max(5, Math.round(40 * (1 - analysisProgress)));
        return `${remainingSeconds} seconds remaining`;
      case 'saving':
        return '5 seconds remaining';
      case 'complete':
        return null;
      default:
        return null;
    }
  };

  return {
    file,
    isProcessing,
    extractionProgress,
    overallProgress,
    currentPhase,
    analysis,
    cleanedText,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
    getPhaseMessage,
    getEstimatedTimeRemaining,
  };
};
