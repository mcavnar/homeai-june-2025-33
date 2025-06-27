
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface InspectionReportContextType {
  pdfText?: string;
}

const InspectionReport = () => {
  const { pdfText } = useOutletContext<InspectionReportContextType>();

  if (!pdfText) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Inspection Report Text
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Original PDF text is not available for this report.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Inspection Report Text
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
            {pdfText}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default InspectionReport;
