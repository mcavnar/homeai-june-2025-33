
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
    
    console.log('Analysis result in Upload:', analysisResult);
    
    if (analysisResult) {
      // Store in sessionStorage as backup
      sessionStorage.setItem('analysisData', JSON.stringify({
        analysis: analysisResult,
        address: analysisResult.propertyInfo?.address,
        pdfText: analysisResult.pdfText || '',
        pdfArrayBuffer: Array.from(new Uint8Array(analysisResult.pdfArrayBuffer || new ArrayBuffer(0)))
      }));

      console.log('Navigating to /results/synopsis with state:', {
        analysis: analysisResult,
        address: analysisResult.propertyInfo?.address,
        pdfText: analysisResult.pdfText || '',
        pdfArrayBuffer: analysisResult.pdfArrayBuffer
      });

      // Navigate directly to synopsis page to avoid redirect
      navigate('/results/synopsis', { 
        state: { 
          analysis: analysisResult,
          address: analysisResult.propertyInfo?.address,
          pdfText: analysisResult.pdfText || '',
          pdfArrayBuffer: analysisResult.pdfArrayBuffer
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
