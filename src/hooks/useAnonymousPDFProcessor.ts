
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { getSessionId } from '@/utils/sessionUtils';

type ProcessingPhase = 'extraction' | 'analysis' | 'saving' | 'complete';

export const useAnonymousPDFProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<ProcessingPhase>('extraction');
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
      const baseTime = 35; // 35 seconds for average case
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
      console.log('Starting anonymous PDF processing');

      // Get session ID
      const sessionId = getSessionId();

      // Convert file to ArrayBuffer and store it
      const arrayBuffer = await file.arrayBuffer();
      setPdfArrayBuffer(arrayBuffer);

      // Upload PDF to Supabase storage
      const fileName = `anonymous/${sessionId}/${Date.now()}-${file.name}`;
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

      const { data, error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: { 
          extractedText: extractionResult.text,
          userEmail: null,
          userId: null,
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

      // Transition to saving phase
      setCurrentPhase('saving');
      setOverallProgress(85);

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      setCleanedText(data.cleanedText || '');

      // Progress to 95% during database save
      setOverallProgress(95);

      // Save to anonymous_reports table
      console.log('Saving report to anonymous_reports table');
      const { data: reportData, error: saveError } = await supabase.from('anonymous_reports').insert({
        session_id: sessionId,
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
        }
      }).select().single();

      if (saveError) {
        console.error('Error saving to anonymous_reports:', saveError);
        throw new Error(`Failed to save report: ${saveError.message}`);
      }

      console.log('Report saved successfully to anonymous_reports:', reportData?.id);

      // Complete the process
      setCurrentPhase('complete');
      setOverallProgress(100);

      toast({
        title: "Analysis complete!",
        description: `Processed ${extractionResult.pageCount} pages and generated comprehensive insights.`,
      });

      return {
        analysis: analysisData,
        pdfArrayBuffer: arrayBuffer,
        pdfText: data.cleanedText || '',
        address: analysisData.propertyInfo?.address,
        sessionId
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
    setPdfArrayBuffer(null);
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
        return 'Saving your report...';
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
    pdfArrayBuffer,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
    getPhaseMessage,
    getEstimatedTimeRemaining,
  };
};
