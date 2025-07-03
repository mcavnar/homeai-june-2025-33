
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadSection from '@/components/FileUploadSection';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';

const UploadPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  
  const {
    file,
    isProcessing,
    extractionProgress,
    error,
    handleFileSelect,
    processPDF,
    resetProcessor,
  } = usePDFProcessor();

  useEffect(() => {
    // Check if user has provided email, redirect if not
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
      navigate('/get-started');
      return;
    }
    setUserEmail(email);
  }, [navigate]);

  const handleProcessPDF = async () => {
    const result = await processPDF();
    
    console.log('Analysis result in UploadPage:', result);
    
    if (result) {
      // Store only essential data in sessionStorage (without ArrayBuffer)
      const sessionData = {
        analysis: result.analysis,
        address: result.address,
        pdfText: result.pdfText,
        userEmail: userEmail
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

  // Don't render anything if we're redirecting
  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Inspection Report</h1>
          <p className="text-gray-600">Upload your home inspection PDF to get started with the analysis</p>
          <p className="text-sm text-gray-500 mt-2">Analysis will be sent to: {userEmail}</p>
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

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Get Started</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Email</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Upload</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                4
              </div>
              <span className="ml-2 text-sm text-gray-600">Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
