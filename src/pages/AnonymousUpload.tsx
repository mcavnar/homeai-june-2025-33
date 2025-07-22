
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { useAnonymousPDFProcessor } from '@/hooks/useAnonymousPDFProcessor';
import { Shield, Clock, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AnonymousUpload = () => {
  const navigate = useNavigate();
  const { trackConversion } = useMetaConversions();
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  
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
        address: result.address,
        sessionId: result.sessionId
      });

      // Navigate to account creation page with result data via state
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
      {/* Header Bar */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏠</span>
            </div>
            <div className="text-xl font-bold text-gray-900">HomeAI</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            <span className="block sm:inline">Upload Your</span>{' '}
            <span className="block sm:inline">Inspection Report</span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            We provide clear, expert-backed analysis with prioritized issues, estimated repair costs and smart negotiation tips. The platform is entirely free to use. You can delete your account and data at any time.
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column - Upload Section */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="bg-white shadow-lg border border-gray-200">
              <div className="p-6 sm:p-8">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer ${
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
                      <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
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
            
            {/* Don't Have Report Button - Moved outside the Card */}
            <Button
              variant="secondary"
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full py-4 px-6 rounded-lg text-lg font-medium"
            >
              Don't Have Your Report?
            </Button>

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
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">What You'll Get</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Private & Secure Analysis</h3>
                      <p className="text-gray-600">Your data is protected and you have complete control of it.</p>
                    </div>
                  </div>

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

                {/* Analysis Time */}
                <div className="border-t pt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Analysis completed in 15-30 seconds</span>
                  </div>
                  
                  {/* Security Trust Indicators */}
                  <div className="flex justify-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-gray-600">SSL Encrypted</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Private & Secure</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};

export default AnonymousUpload;
