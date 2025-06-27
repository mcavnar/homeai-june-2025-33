
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';

interface InspectionReportContextType {
  pdfArrayBuffer?: ArrayBuffer;
}

const InspectionReport = () => {
  const { pdfArrayBuffer } = useOutletContext<InspectionReportContextType>();

  console.log('InspectionReport - pdfArrayBuffer:', pdfArrayBuffer ? 'Available' : 'Not available');

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
      </div>
      <PDFViewer pdfArrayBuffer={pdfArrayBuffer} />
    </div>
  );
};

export default InspectionReport;
