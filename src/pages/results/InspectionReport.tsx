
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';

interface InspectionReportContextType {
  pdfText?: string;
  pdfArrayBuffer?: ArrayBuffer;
}

const InspectionReport = () => {
  const { pdfText, pdfArrayBuffer } = useOutletContext<InspectionReportContextType>();

  if (!pdfText && !pdfArrayBuffer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Inspection Report
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Original PDF and text data are not available for this report.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={pdfArrayBuffer ? "pdf" : "text"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf" disabled={!pdfArrayBuffer} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            PDF View
          </TabsTrigger>
          <TabsTrigger value="text" disabled={!pdfText} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Text View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pdf" className="mt-6">
          {pdfArrayBuffer ? (
            <PDFViewer pdfArrayBuffer={pdfArrayBuffer} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">PDF data is not available for viewing.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="text" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Extracted Text Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pdfText ? (
                <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {pdfText}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Text content is not available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InspectionReport;
