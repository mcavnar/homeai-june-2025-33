
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import { useAnonymousPDFProcessor } from '@/hooks/useAnonymousPDFProcessor';

const AnonymousUploadPage = () => {
  const navigate = useNavigate();
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

  const handleProcessPDF = async () => {
    const result = await processPDF();
    
    console.log('Anonymous analysis result:', result);
    
    if (result) {
      // Store analysis data temporarily for anonymous users
      const sessionData = {
        analysis: result.analysis,
        address: result.address,
        pdfText: result.pdfText,
        sessionId: result.sessionId,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('anonymousAnalysisData', JSON.stringify(sessionData));

      console.log('Navigating to complete-signup with preview');

      // Navigate to signup completion page with preview
      navigate('/complete-signup', { 
        state: { hasAnalysis: true }
      });
    } else {
      console.log('No analysis result - not navigating');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Your Free Home Inspection Analysis</h1>
          <p className="text-gray-600">Upload your inspection PDF to see instant repair costs and negotiation advice - no account required to start!</p>
        </div>

        <FileUploadSection
          file={file}
          isProcessing={isProcessing}
          overallProgress={overallProgress}
          phaseMessage={getPhaseMessage()}
          error={error}
          onFileSelect={handleFileSelect}
          onProcess={handleProcessPDF}
          onReset={resetProcessor}
        />

        <ProcessingStatus
          isProcessing={isProcessing}
          overallProgress={overallProgress}
          phaseMessage={getPhaseMessage()}
          estimatedTimeRemaining={getEstimatedTimeRemaining()}
        />

        {/* Simple progress indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Upload Report</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Create Account</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">View Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousUploadPage;
