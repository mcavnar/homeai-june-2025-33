
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadSection from '@/components/FileUploadSection';
import ProcessingStatus from '@/components/ProcessingStatus';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';

const Upload = () => {
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
  } = usePDFProcessor();

  const handleProcessPDF = async () => {
    const result = await processPDF();
    
    console.log('Analysis result in Upload:', result);
    
    if (result) {
      // Store only essential data in sessionStorage (without ArrayBuffer)
      const sessionData = {
        analysis: result.analysis,
        address: result.address,
        pdfText: result.pdfText
      };
      
      sessionStorage.setItem('analysisData', JSON.stringify(sessionData));

      console.log('Navigating to /results/synopsis with state');

      // Navigate directly to synopsis page with complete data via state
      navigate('/results/synopsis', { 
        state: result
      });
    } else {
      console.log('No analysis result - not navigating');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Inspection Report Analyzer</h1>
          <p className="text-gray-600">Upload a home inspection PDF and get an intelligent summary with prioritized findings and cost estimates</p>
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
      </div>
    </div>
  );
};

export default Upload;
