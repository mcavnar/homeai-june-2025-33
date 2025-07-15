
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { HomeInspectionAnalysis } from '@/types/inspection';
import { generateSessionId } from '@/utils/sessionUtils';
import { fetchPropertyData } from '@/utils/propertyDataService';
import { generateNegotiationStrategy } from '@/utils/negotiationStrategyService';

type ProcessingPhase = 'extraction' | 'analysis' | 'property' | 'negotiation' | 'saving' | 'complete';

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

  const simulateProgressFor = (phase: ProcessingPhase, startProgress: number, endProgress: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const totalProgressRange = endProgress - startProgress;
      const startTime = Date.now();
      const interval = 200;
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progressRatio, 2);
        const currentProgress = startProgress + (totalProgressRange * easedProgress);
        
        setOverallProgress(Math.min(currentProgress, endProgress));
        
        if (progressRatio >= 1) {
          clearInterval(progressInterval);
          resolve();
        }
      }, interval);
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
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });

      // Generate a unique session ID for this PDF processing operation
      const uniqueSessionId = generateSessionId();
      console.log('Generated unique session ID for this processing:', uniqueSessionId);

      // Convert file to ArrayBuffer and store it
      const arrayBuffer = await file.arrayBuffer();
      console.log('File converted to ArrayBuffer, size:', arrayBuffer.byteLength);
      setPdfArrayBuffer(arrayBuffer);

      // Upload PDF to Supabase storage
      console.log('Uploading PDF to Supabase storage...');
      const fileName = `anonymous/${uniqueSessionId}/${Date.now()}-${file.name}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('inspection-reports')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('PDF upload error:', uploadError);
        // Continue without PDF storage - not critical for analysis
      } else {
        console.log('PDF uploaded successfully:', uploadData?.path);
      }

      // Extract text from PDF
      console.log('Starting text extraction from PDF...');
      toast({
        title: "Extracting text from PDF...",
        description: "Processing your document, please wait.",
      });

      const extractionStartTime = Date.now();
      const extractionResult = await extractTextFromPDF(file, (progress) => {
        setExtractionProgress(progress);
        setOverallProgress((progress / 100) * 20);
      });
      const extractionEndTime = Date.now();
      console.log(`Text extraction completed in ${(extractionEndTime - extractionStartTime) / 1000} seconds`);

      if (extractionResult.error) {
        console.error('PDF extraction error:', extractionResult.error);
        throw new Error(extractionResult.error);
      }

      if (!extractionResult.text || extractionResult.text.length < 50) {
        console.error('Insufficient text extracted:', {
          textLength: extractionResult.text?.length || 0,
          pageCount: extractionResult.pageCount
        });
        throw new Error('Unable to extract sufficient text from PDF. The document may be image-based or corrupted.');
      }

      console.log('Text extracted successfully:', {
        textLength: extractionResult.text.length,
        pageCount: extractionResult.pageCount
      });

      // Transition to AI analysis phase
      setCurrentPhase('analysis');
      setOverallProgress(20);

      toast({
        title: "Analyzing with AI...",
        description: "Processing the content with OpenAI for detailed insights.",
      });

      // Start simulated progress for AI analysis
      const aiProgressPromise = simulateProgressFor('analysis', 20, 50, 25000);

      // Prepare payload for the edge function
      const payload = { 
        extractedText: extractionResult.text,
        userEmail: null,
        userId: null,
        emailCaptureSource: 'anonymous-upload'
      };

      console.log('Calling process-pdf edge function...');
      const edgeFunctionStartTime = Date.now();
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Analysis timed out after 120 seconds')), 120000);
      });

      const analysisPromise = supabase.functions.invoke('process-pdf', {
        body: payload,
      });

      const { data, error: functionError } = await Promise.race([
        analysisPromise,
        timeoutPromise
      ]) as any;
      
      const edgeFunctionEndTime = Date.now();
      console.log(`Edge function completed in ${(edgeFunctionEndTime - edgeFunctionStartTime) / 1000} seconds`);

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message || 'Analysis failed');
      }

      if (!data || !data.success) {
        console.error('Analysis failed:', data?.error || 'Unknown error');
        throw new Error(data?.error || 'Failed to analyze extracted text');
      }

      console.log('Analysis completed successfully');
      await aiProgressPromise;

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      setCleanedText(data.cleanedText || '');

      // Transition to property data phase
      setCurrentPhase('property');
      setOverallProgress(50);

      toast({
        title: "Fetching property data...",
        description: "Getting market information for your property.",
      });

      let propertyData = null;
      if (analysisData.propertyInfo?.address) {
        const propertyProgressPromise = simulateProgressFor('property', 50, 70, 8000);
        try {
          propertyData = await fetchPropertyData(analysisData.propertyInfo.address);
        } catch (err) {
          console.error('Property data fetch failed:', err);
          // Continue without property data
        }
        await propertyProgressPromise;
      }

      // Transition to negotiation strategy phase
      setCurrentPhase('negotiation');
      setOverallProgress(70);

      toast({
        title: "Generating negotiation strategy...",
        description: "Creating personalized negotiation recommendations.",
      });

      let negotiationStrategy = null;
      const negotiationProgressPromise = simulateProgressFor('negotiation', 70, 85, 10000);
      try {
        negotiationStrategy = await generateNegotiationStrategy(analysisData, propertyData);
      } catch (err) {
        console.error('Negotiation strategy generation failed:', err);
        // Continue without negotiation strategy
      }
      await negotiationProgressPromise;

      // Transition to saving phase
      setCurrentPhase('saving');
      setOverallProgress(85);

      toast({
        title: "Saving your report...",
        description: "Finalizing your analysis report.",
      });

      // Save to anonymous_reports table using the unique session ID
      console.log('Saving report to anonymous_reports table with unique session ID:', uniqueSessionId);
      const dbSaveStartTime = Date.now();
      
      const { data: reportData, error: saveError } = await supabase.from('anonymous_reports').insert({
        session_id: uniqueSessionId,
        analysis_data: analysisData,
        property_data: propertyData,
        negotiation_strategy: negotiationStrategy,
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

      const dbSaveEndTime = Date.now();
      console.log(`Database save completed in ${(dbSaveEndTime - dbSaveStartTime) / 1000} seconds`);

      if (saveError) {
        console.error('Error saving to anonymous_reports:', saveError);
        throw new Error(`Failed to save report: ${saveError.message}`);
      }

      console.log('Report saved successfully to anonymous_reports:', reportData?.id);

      // Store the session ID in localStorage for later retrieval
      localStorage.setItem('anonymous_session_id', uniqueSessionId);
      console.log('Session ID stored in localStorage for later retrieval');

      // Complete the process
      setCurrentPhase('complete');
      setOverallProgress(100);

      toast({
        title: "Analysis complete!",
        description: `Processed ${extractionResult.pageCount} pages and generated comprehensive insights.`,
      });

      return {
        analysis: analysisData,
        propertyData: propertyData,
        negotiationStrategy: negotiationStrategy,
        pdfArrayBuffer: arrayBuffer,
        pdfText: data.cleanedText || '',
        address: analysisData.propertyInfo?.address,
        sessionId: uniqueSessionId
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
      case 'property':
        return 'Fetching property market data...';
      case 'negotiation':
        return 'Generating negotiation strategy...';
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
        const analysisProgress = (overallProgress - 20) / 30;
        const remainingSeconds = Math.max(5, Math.round(25 * (1 - analysisProgress)));
        return `${remainingSeconds} seconds remaining`;
      case 'property':
        return '8 seconds remaining';
      case 'negotiation':
        return '10 seconds remaining';
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
