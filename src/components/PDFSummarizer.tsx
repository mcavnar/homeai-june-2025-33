import React, { useState, useRef } from 'react';
import { Loader2, AlertCircle, FileText, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { usePropertyData } from '@/hooks/usePropertyData';
import { HomeInspectionAnalysis } from '@/types/inspection';
import PropertyDetails from './PropertyDetails';
import PropertyInfo from './PropertyInfo';
import ExecutiveSummary from './ExecutiveSummary';
import CostSummary from './CostSummary';
import SafetyIssues from './SafetyIssues';
import DetailedFindings from './DetailedFindings';
import MajorSystems from './MajorSystems';
import FileUploadSection from './FileUploadSection';
import ConditionScore from './ConditionScore';

const PDFSummarizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [analysis, setAnalysis] = useState<HomeInspectionAnalysis | null>(null);
  const [cleanedText, setCleanedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    resetPropertyData,
  } = usePropertyData();

  const handleFileSelect = (selectedFile: File) => {
    // Reset previous state
    setAnalysis(null);
    setError('');
    resetPropertyData();

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
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setExtractionProgress(0);
    resetPropertyData();

    try {
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
        body: { extractedText: extractionResult.text },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze extracted text');
      }

      setAnalysis(data.analysis);
      setCleanedText(data.cleanedText || '');

      toast({
        title: "Analysis complete!",
        description: `Processed ${extractionResult.pageCount} pages and generated comprehensive insights.`,
      });

      // Fetch property data if address is available
      if (data.analysis?.propertyInfo?.address) {
        await fetchPropertyDetails(data.analysis.propertyInfo.address);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF';
      setError(errorMessage);
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setExtractionProgress(0);
    }
  };

  const resetTool = () => {
    setFile(null);
    setAnalysis(null);
    setCleanedText('');
    setError('');
    resetPropertyData();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Inspection Report Analyzer</h1>
        <p className="text-gray-600">Upload a home inspection PDF and get an intelligent summary with prioritized findings and cost estimates</p>
      </div>

      {/* Upload Section */}
      <FileUploadSection
        file={file}
        isProcessing={isProcessing}
        extractionProgress={extractionProgress}
        error={error}
        onFileSelect={handleFileSelect}
        onProcess={processPDF}
        onReset={resetTool}
      />

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Property Information */}
          {analysis.propertyInfo && (
            <PropertyInfo
              address={analysis.propertyInfo.address}
              inspectionDate={analysis.propertyInfo.inspectionDate}
            />
          )}

          {/* Condition Score Section - Only show when we have both analysis and property data */}
          {propertyData && (
            <ConditionScore analysis={analysis} propertyData={propertyData} />
          )}

          {/* Executive Summary */}
          {analysis.executiveSummary && analysis.executiveSummary.length > 0 && (
            <ExecutiveSummary summary={analysis.executiveSummary} />
          )}

          {/* Cost Summary */}
          {analysis.costSummary && (
            <CostSummary costSummary={analysis.costSummary} />
          )}

          {/* Safety Issues */}
          {analysis.safetyIssues && analysis.safetyIssues.length > 0 && (
            <SafetyIssues issues={analysis.safetyIssues} />
          )}

          {/* Detailed Issues */}
          {analysis.issues && analysis.issues.length > 0 && (
            <DetailedFindings issues={analysis.issues} />
          )}

          {/* Major Systems */}
          {analysis.majorSystems && (
            <MajorSystems systems={analysis.majorSystems} />
          )}
        </div>
      )}

      {/* Property Details Section */}
      {propertyData && (
        <PropertyDetails propertyData={propertyData} />
      )}

      {/* Property Loading State */}
      {isLoadingProperty && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <div className="text-center">
                <p className="font-medium text-gray-900">Fetching property details...</p>
                <p className="text-sm text-gray-600">Looking up market information</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Error */}
      {propertyError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Property details unavailable: {propertyError}
          </AlertDescription>
        </Alert>
      )}

      {/* Cleaned PDF Text Display */}
      {cleanedText && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Cleaned PDF Text
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </CardTitle>
                <CardDescription>
                  The processed text that was sent to AI for analysis ({cleanedText.length.toLocaleString()} characters)
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <Textarea
                  value={cleanedText}
                  readOnly
                  className="min-h-[400px] font-mono text-sm bg-gray-50"
                  placeholder="Cleaned text will appear here..."
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  {extractionProgress > 0 ? `Extracting text... ${Math.round(extractionProgress)}%` : 'Analyzing your home inspection report with AI...'}
                </p>
                <p className="text-sm text-gray-600">
                  {extractionProgress > 0 ? 'Reading PDF content' : 'Generating comprehensive insights and cost estimates'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFSummarizer;
