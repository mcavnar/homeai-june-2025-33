
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadSection from '@/components/FileUploadSection';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';

const Upload = () => {
  const navigate = useNavigate();
  const {
    file,
    isProcessing,
    extractionProgress,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
  } = usePDFProcessor();

  const handleProcessPDF = async () => {
    const analysisResult = await processPDF();
    
    if (analysisResult) {
      // Navigate to results page with the analysis data and PDF text
      navigate('/results', { 
        state: { 
          analysis: analysisResult,
          address: analysisResult.propertyInfo?.address,
          pdfText: analysisResult.pdfText || ''
        } 
      });
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
          extractionProgress={extractionProgress}
          error={error}
          onFileSelect={handleFileSelect}
          onProcess={handleProcessPDF}
          onReset={resetProcessor}
        />
      </div>
    </div>
  );
};

export default Upload;
