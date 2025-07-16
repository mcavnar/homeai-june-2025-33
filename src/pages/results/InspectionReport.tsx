
import React, { useEffect, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PDFViewer from '@/components/PDFViewer';

interface InspectionReportContextType {
  pdfArrayBuffer?: ArrayBuffer;
  isDownloadingPDF?: boolean;
  pdfDownloadError?: string;
  pdfFilePath?: string;
}

interface LocationState {
  searchQuery?: string;
  issueDescription?: string;
  issueLocation?: string;
}

const InspectionReport = () => {
  const { 
    pdfArrayBuffer, 
    isDownloadingPDF, 
    pdfDownloadError, 
    pdfFilePath 
  } = useOutletContext<InspectionReportContextType>();
  
  const location = useLocation();
  const pdfViewerRef = useRef<any>(null);
  
  const locationState = location.state as LocationState;

  console.log('InspectionReport render state:', {
    pdfArrayBuffer: pdfArrayBuffer ? `Available (${pdfArrayBuffer.byteLength} bytes)` : 'Not available',
    isDownloadingPDF,
    pdfDownloadError,
    pdfFilePath,
    searchContext: locationState
  });

  // Show loading state while PDF is being downloaded
  if (isDownloadingPDF) {
    console.log('Showing PDF download loading state');
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
          <CardContent className="text-center py-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-gray-600">Downloading PDF from storage...</p>
            </div>
            <p className="text-gray-400 text-sm">
              Please wait while we retrieve your inspection report.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if PDF download failed
  if (pdfDownloadError) {
    console.log('Showing PDF download error state:', pdfDownloadError);
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Report</h1>
          <div className="text-gray-600 text-lg">
            <p>Original PDF inspection report with search functionality</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Failed to load PDF:</strong> {pdfDownloadError}
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <FileText className="h-16 w-16 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Unavailable</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't load your inspection report PDF. This might be due to:
                </p>
                <ul className="text-sm text-gray-500 text-left space-y-1 mb-4">
                  <li>• Storage permissions issue</li>
                  <li>• File corruption during upload</li>
                  <li>• Network connectivity problems</li>
                </ul>
                {pdfFilePath && (
                  <p className="text-xs text-gray-400 mb-4">
                    File path: {pdfFilePath}
                  </p>
                )}
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="mr-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state if no PDF is available yet (but not actively downloading)
  if (!pdfArrayBuffer && !isDownloadingPDF) {
    console.log('Showing no PDF available state');
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
          <CardContent className="text-center py-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
            <p className="text-gray-400 text-sm">
              {pdfFilePath ? 'Preparing your inspection report...' : 'No PDF file available for this report.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show PDF viewer when PDF is available
  console.log('Showing PDF viewer with ArrayBuffer');
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
