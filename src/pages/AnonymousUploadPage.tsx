
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import TrustSignals from '@/components/TrustSignals';
import ProcessSteps from '@/components/ProcessSteps';
import ValuePropositionBanner from '@/components/ValuePropositionBanner';
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
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Value Proposition Header */}
        <ValuePropositionBanner />

        {/* Process Steps */}
        <ProcessSteps currentStep={1} />

        {/* Main Upload Section */}
        <div className="space-y-6">
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

          {/* Trust Signals Below Upload */}
          <TrustSignals />
        </div>

        {/* Bottom "As Seen In" Section */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Trusted by real estate professionals</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-600">
              Real Estate Weekly
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-600">
              Property Insider
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-600">
              Home Buyer's Guide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousUploadPage;
