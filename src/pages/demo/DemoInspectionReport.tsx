
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const DemoInspectionReport = () => {
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
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Report Preview</h3>
          <p className="text-gray-500 mb-4">
            In a real report, you would see the full PDF inspection document here with search functionality.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
            <h4 className="font-semibold mb-3">Sample Report Content:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Property:</strong> 1234 Maple Street, Springfield, IL 62704</p>
              <p><strong>Inspection Date:</strong> March 15, 2024</p>
              <p><strong>Inspector:</strong> John Smith, Licensed Home Inspector</p>
              <p className="pt-2">
                This comprehensive home inspection identified several areas requiring attention,
                including roofing maintenance, electrical system updates, and minor plumbing repairs.
                The property's major systems are generally in good condition with regular maintenance needs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoInspectionReport;
