import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, DollarSign, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPDF } from '@/utils/pdfTextExtractor';
import { fetchPropertyData, RedfinPropertyData } from '@/services/redfinApi';
import PropertyDetails from './PropertyDetails';

interface InspectionIssue {
  description: string;
  location: string;
  priority: 'high' | 'medium';
  estimatedCost: {
    min: number;
    max: number;
  };
  category: string;
}

interface HomeInspectionAnalysis {
  propertyInfo?: {
    address?: string;
    inspectionDate?: string;
  };
  executiveSummary?: string[];
  majorSystems?: {
    roof?: string;
    foundation?: string;
    electrical?: string;
    plumbing?: string;
    hvac?: string;
  };
  issues?: InspectionIssue[];
  safetyIssues?: string[];
  costSummary?: {
    highPriorityTotal: {
      min: number;
      max: number;
    };
    mediumPriorityTotal: {
      min: number;
      max: number;
    };
    grandTotal: {
      min: number;
      max: number;
    };
  };
}

const PDFSummarizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [analysis, setAnalysis] = useState<HomeInspectionAnalysis | null>(null);
  const [cleanedText, setCleanedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [propertyData, setPropertyData] = useState<RedfinPropertyData | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    // Reset previous state
    setAnalysis(null);
    setError('');
    setPropertyData(null);
    setPropertyError('');

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const processPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setExtractionProgress(0);
    setPropertyData(null);
    setPropertyError('');

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

  const fetchPropertyDetails = async (address: string) => {
    setIsLoadingProperty(true);
    setPropertyError('');

    try {
      console.log('Fetching property details for address:', address);
      
      toast({
        title: "Fetching property details...",
        description: "Looking up market information for this property.",
      });

      const data = await fetchPropertyData(address);
      setPropertyData(data);

      toast({
        title: "Property details loaded!",
        description: "Market information and property stats have been added.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property details';
      setPropertyError(errorMessage);
      console.error('Property fetch error:', err);
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setAnalysis(null);
    setCleanedText('');
    setError('');
    setPropertyData(null);
    setPropertyError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderPriorityBadge = (priority: 'high' | 'medium') => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Inspection Report Analyzer</h1>
        <p className="text-gray-600">Upload a home inspection PDF and get an intelligent summary with prioritized findings and cost estimates</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Home Inspection Report
          </CardTitle>
          <CardDescription>
            Select or drag & drop a PDF file (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-12 w-12 text-blue-500" />
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="text-gray-600">Click to select or drag & drop your home inspection PDF</p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
            )}
          </div>

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              onClick={processPDF}
              disabled={!file || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {extractionProgress > 0 ? `Extracting... ${Math.round(extractionProgress)}%` : 'Analyzing with AI...'}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze Home Inspection Report
                </>
              )}
            </Button>
            
            {file && (
              <Button onClick={resetTool} variant="outline">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Property Information */}
          {analysis.propertyInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.propertyInfo.address && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-700">{analysis.propertyInfo.address}</p>
                    </div>
                  )}
                  {analysis.propertyInfo.inspectionDate && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Inspection Date
                      </h4>
                      <p className="text-gray-700">{analysis.propertyInfo.inspectionDate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Executive Summary */}
          {analysis.executiveSummary && analysis.executiveSummary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="h-5 w-5" />
                  Overall Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.executiveSummary.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <p className="text-gray-800 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Cost Summary */}
          {analysis.costSummary && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <DollarSign className="h-5 w-5" />
                  Estimated Repair Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
                    <p className="text-2xl font-bold text-red-900">
                      {formatCurrency(analysis.costSummary.highPriorityTotal.min)} - {formatCurrency(analysis.costSummary.highPriorityTotal.max)}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
                    <p className="text-2xl font-bold text-yellow-900">
                      {formatCurrency(analysis.costSummary.mediumPriorityTotal.min)} - {formatCurrency(analysis.costSummary.mediumPriorityTotal.max)}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Total Estimate</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(analysis.costSummary.grandTotal.min)} - {formatCurrency(analysis.costSummary.grandTotal.max)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety Issues */}
          {analysis.safetyIssues && analysis.safetyIssues.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-5 w-5" />
                  Safety Concerns
                </CardTitle>
                <CardDescription>These issues pose immediate safety risks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.safetyIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-gray-800 leading-relaxed">{issue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Issues */}
          {analysis.issues && analysis.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Findings & Cost Estimates</CardTitle>
                <CardDescription>All identified issues with location and estimated repair costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {renderPriorityBadge(issue.priority)}
                          <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">{issue.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(issue.estimatedCost.min)} - {formatCurrency(issue.estimatedCost.max)}
                          </p>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{issue.description}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {issue.location}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Major Systems */}
          {analysis.majorSystems && (
            <Card>
              <CardHeader>
                <CardTitle>Major Systems Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(analysis.majorSystems).map(([system, finding]) => (
                    finding && (
                      <div key={system} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 capitalize mb-2">{system}</h4>
                        <p className="text-gray-700 text-sm">{finding}</p>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
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
