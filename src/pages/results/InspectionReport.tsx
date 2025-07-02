
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

  if (!pdfArrayBuffer) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Report</h1>
          <div className="text-gray-600 text-lg">
            <p>Original PDF inspection report with search functionality</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Inspection Report
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Original PDF is not available for viewing.</p>
            <p className="text-gray-400 text-sm mt-2">
              Please upload an inspection report to view it here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Report</h1>
        <div className="text-gray-600 text-lg flex items-center justify-between">
          <p>Original PDF inspection report with search functionality</p>
          {locationState?.issueDescription && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Searching for: {locationState.issueLocation}
            </div>
          )}
        </div>
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
