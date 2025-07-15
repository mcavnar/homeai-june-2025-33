
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import { useAnonymousPDFProcessor } from '@/hooks/useAnonymousPDFProcessor';
import { Shield, Clock, CheckCircle, Upload, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AnonymousUpload = () => {
  const navigate = useNavigate();
  const { trackConversion } = useMetaConversions();
  
  const {
    file,
    isProcessing,
    overallProgress,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
    getPhaseMessage,
    getEstimatedTimeRemaining,
  } = useAnonymousPDFProcessor();

  const handleFileSelectWithTracking = (selectedFile: File) => {
    trackConversion({
      eventName: 'Lead',
      contentName: 'Anonymous PDF Upload Started'
    });

    handleFileSelect(selectedFile);
  };

  const handleProcessPDF = async () => {
    console.log('=== STARTING PDF PROCESSING FROM ANONYMOUS UPLOAD ===');
    
    const result = await processPDF();
    
    console.log('=== PDF PROCESSING COMPLETED ===');
    console.log('Result received:', result);
    
    if (result) {
      console.log('=== RESULT VALIDATION ===');
      console.log('Has analysis:', !!result.analysis);
      console.log('Has property data:', !!result.propertyData);
      console.log('Has negotiation strategy:', !!result.negotiationStrategy);
      console.log('Address:', result.address);
      console.log('Session ID:', result.sessionId);
      
      // Track analysis completion
      const totalRepairCosts = result.analysis?.costSummary?.totalEstimatedCost || 0;
      console.log('Total repair costs for tracking:', totalRepairCosts);
      
      await trackConversion({
        eventName: 'AnalysisComplete',
        value: totalRepairCosts,
        contentName: 'Anonymous PDF Analysis Complete'
      });

      console.log('=== NAVIGATING TO ACCOUNT CREATION ===');
      console.log('Navigation state being passed:', {
        hasAnalysis: !!result.analysis,
        hasPropertyData: !!result.propertyData,
        hasNegotiationStrategy: !!result.negotiationStrategy,
        address: result.address,
        sessionId: result.sessionId
      });

      // Navigate to account creation page with complete data via state
      navigate('/account-creation', { 
        state: result
      });
    } else {
      console.error('=== NO RESULT FROM PDF PROCESSING ===');
      console.error('ProcessPDF returned null - analysis failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Home Inspection Report
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Get AI-powered analysis with prioritized findings, accurate cost estimates, and negotiation guidance in minutes.
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Upload Section */}
          <div className="space-y-8">
            <Card className="bg-white shadow-lg border border-gray-200">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Upload className="h-5 w-5 text-green-600" />
                  <p className="text-gray-600">Select or drag & drop a PDF file (max 10MB)</p>
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                    file 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
                  }`}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        handleFileSelectWithTracking(selectedFile);
                      }
                    }}
                    className="hidden"
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-700 font-medium mb-2">
                          Click to select or drag & drop your home inspection PDF
                        </p>
                        <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Process Button */}
                <Button
                  onClick={handleProcessPDF}
                  disabled={!file || isProcessing}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing... {Math.round(overallProgress)}%
                    </>
                  ) : (
                    'Analyze Home Inspection Report'
                  )}
                </Button>
              </div>
            </Card>

            {/* Processing Status */}
            <ProcessingStatus
              isProcessing={isProcessing}
              overallProgress={overallProgress}
              phaseMessage={getPhaseMessage()}
              estimatedTimeRemaining={getEstimatedTimeRemaining()}
            />
          </div>

          {/* Right Column - What You'll Get */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">What You'll Get</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">At a Glance</h3>
                      <p className="text-gray-600">Clear overview of your property's condition</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Prioritized Issues</h3>
                      <p className="text-gray-600">What needs attention first, second, and later</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Cost Estimates</h3>
                      <p className="text-gray-600">Accurate repair costs for budgeting</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Market Comparison</h3>
                      <p className="text-gray-600">How your property compares to similar homes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Negotiation Strategy</h3>
                      <p className="text-gray-600">Practical guidance for talking with sellers</p>
                    </div>
                  </div>
                </div>

                {/* Analysis Time & Security */}
                <div className="border-t pt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Analysis completed in 2-3 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Your data is secure and private</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Privacy Protection Box - Centered at Bottom */}
        <div className="flex justify-center mt-16 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Your Privacy is Protected</h3>
            </div>
            <p className="text-gray-700 text-center">
              We use enterprise-grade encryption to protect your data throughout the analysis process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousUpload;
