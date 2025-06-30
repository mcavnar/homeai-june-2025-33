
import React, { useEffect, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';

interface InspectionReportContextType {
  pdfArrayBuffer?: ArrayBuffer;
}

interface LocationState {
  searchQuery?: string;
  issueDescription?: string;
  issueLocation?: string;
}

const InspectionReport = () => {
  const { pdfArrayBuffer } = useOutletContext<InspectionReportContextType>();
  const location = useLocation();
  const pdfViewerRef = useRef<any>(null);
  
  const locationState = location.state as LocationState;

  console.log('InspectionReport - pdfArrayBuffer:', pdfArrayBuffer ? 'Available' : 'Not available');
  console.log('InspectionReport - search context:', locationState);

  // Auto-trigger search when component mounts with search context
  useEffect(() => {
    if (locationState?.searchQuery && pdfViewerRef.current) {
      // Small delay to ensure PDF is loaded
      setTimeout(() => {
        console.log('Auto-triggering search for:', locationState.searchQuery);
        // The search will be handled by the PDFViewer component
      }, 1000);
    }
  }, [locationState?.searchQuery]);

  if (!pdfArrayBuffer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Inspection Report
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Original PDF is not available for viewing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Inspection Report</h1>
        {locationState?.issueDescription && (
          <div className="ml-auto text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Searching for: {locationState.issueLocation}
          </div>
        )}
      </div>
      <PDFViewer 
        ref={pdfViewerRef}
        pdfArrayBuffer={pdfArrayBuffer} 
        initialSearchQuery={locationState?.searchQuery}
      />
    </div>
  );
};

export default InspectionReport;
