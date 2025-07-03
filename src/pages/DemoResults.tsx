
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import ResultsSidebar from '@/components/ResultsSidebar';
import { demoAnalysis, demoPropertyData, demoNegotiationStrategy } from '@/data/demoData';

const DemoResults = () => {
  const navigate = useNavigate();

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

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* CTA Button */}
        <Button
          onClick={handleGetStarted}
          className="fixed top-4 right-4 z-50 shadow-lg"
          variant="default"
        >
          Get Started With Your Own Report
        </Button>
        
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
