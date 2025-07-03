
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import ResultsSidebar from '@/components/ResultsSidebar';
import { demoAnalysis, demoPropertyData, demoNegotiationStrategy } from '@/data/demoData';

const DemoResults = () => {
  // Create a mock PDF ArrayBuffer for demo purposes
  const mockPdfArrayBuffer = new ArrayBuffer(0);

  const contextValue = {
    analysis: demoAnalysis,
    propertyData: demoPropertyData,
    isLoadingProperty: false,
    propertyError: '',
    negotiationStrategy: demoNegotiationStrategy,
    isGeneratingStrategy: false,
    strategyError: '',
    pdfText: "This is a demo inspection report. The original PDF content would be displayed here in a real report.",
    pdfArrayBuffer: mockPdfArrayBuffer,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Demo Indicator */}
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          Demo Report
        </div>
        
        <ResultsSidebar />
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet context={contextValue} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DemoResults;
