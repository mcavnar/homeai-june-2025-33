
import React from 'react';
import { Loader2, AlertCircle, FileText, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import PropertyDetails from './PropertyDetails';
import FileUploadSection from './FileUploadSection';
import AnalysisResults from './AnalysisResults';
import ProcessingStatus from './ProcessingStatus';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useNegotiationStrategy } from '@/hooks/useNegotiationStrategy';

const PDFSummarizer = () => {
  const {
    file,
    isProcessing,
    extractionProgress,
    analysis,
    cleanedText,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
  } = usePDFProcessor();

  const {
    propertyData,
    isLoadingProperty,
    propertyError,
    fetchPropertyDetails,
    resetPropertyData,
  } = usePropertyData();

  const {
    negotiationStrategy,
    isGeneratingStrategy,
    strategyError,
    resetStrategy,
  } = useNegotiationStrategy(analysis, propertyData);

  const handleFileSelectAndReset = (selectedFile: File) => {
    // Reset all states when a new file is selected
    resetStrategy();
    resetPropertyData();
    handleFileSelect(selectedFile);
  };

  const handleProcessPDF = async () => {
    const analysisResult = await processPDF();
    
    // Fetch property data if address is available
    if (analysisResult?.analysis?.propertyInfo?.address) {
      await fetchPropertyDetails(analysisResult.analysis.propertyInfo.address);
    }
  };

  const resetTool = () => {
    resetProcessor();
    resetStrategy();
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
        onFileSelect={handleFileSelectAndReset}
        onProcess={handleProcessPDF}
        onReset={resetTool}
      />

      {/* Analysis Results */}
      {analysis && (
        <AnalysisResults
          analysis={analysis}
          propertyData={propertyData}
          negotiationStrategy={negotiationStrategy}
          isGeneratingStrategy={isGeneratingStrategy}
          strategyError={strategyError}
        />
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
      <ProcessingStatus isProcessing={isProcessing} extractionProgress={extractionProgress} />
    </div>
  );
};

export default PDFSummarizer;
