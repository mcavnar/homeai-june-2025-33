
import React from 'react';
import { useSharedReport } from '@/contexts/SharedReportContext';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const SharedInspectionReport = () => {
  const { pdfPath } = useSharedReport();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Report</h1>
        <div className="text-gray-600 text-lg">
          <p>Original PDF inspection report</p>
        </div>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <FileText className="h-16 w-16 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Report</h3>
              <p className="text-gray-600 mb-4">
                The original PDF inspection report is available for download.
              </p>
              {pdfPath ? (
                <p className="text-sm text-gray-500">
                  PDF viewing is available in the full version of this report.
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  No PDF file available for this report.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedInspectionReport;
