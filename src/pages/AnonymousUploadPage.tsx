import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaConversions } from '@/hooks/useMetaConversions';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import { useAnonymousPDFProcessor } from '@/hooks/useAnonymousPDFProcessor';

const AnonymousUploadPage = () => {
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
    // Track the PDF upload started event
    trackConversion({
      eventName: 'AnalyzeReport',
      contentName: 'Anonymous PDF Upload Started'
    });

    // Call the original file select handler
    handleFileSelect(selectedFile);
  };

  const handleProcessPDF = async () => {
    console.log('Starting anonymous PDF processing...');
    const result = await processPDF();
    
    if (result) {
      console.log('Anonymous processing complete, result:', {
        hasAnalysis: !!result.analysis,
        sessionId: result.sessionId
      });

      // Track analysis completion - use grandTotal.max as a number
      const totalRepairCosts = result.analysis?.costSummary?.grandTotal?.max || 0;
      await trackConversion({
        eventName: 'AnalysisComplete',
        value: totalRepairCosts,
        contentName: 'Anonymous PDF Analysis Complete'
      });

      console.log('Redirecting to email capture page...');
      // Navigate to email capture page with the analysis data
      navigate('/email-capture', { 
        state: {
          analysis: result.analysis,
          pdfText: result.pdfText,
          sessionId: result.sessionId
        }
      });
    } else {
      console.log('No analysis result - not navigating');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Inspection Report</h1>
          <p className="text-gray-600">Upload your home inspection PDF to get started with the analysis</p>
          <p className="text-sm text-gray-500 mt-2">Free analysis - no account required</p>
        </div>

        <FileUploadSection
          file={file}
          isProcessing={isProcessing}
          overallProgress={overallProgress}
          phaseMessage={getPhaseMessage()}
          error={error}
          onFileSelect={handleFileSelectWithTracking}
          onProcess={handleProcessPDF}
          onReset={resetProcessor}
        />

        <ProcessingStatus
          isProcessing={isProcessing}
          overallProgress={overallProgress}
          phaseMessage={getPhaseMessage()}
          estimatedTimeRemaining={getEstimatedTimeRemaining()}
        />

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Upload</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Email</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousUploadPage;
