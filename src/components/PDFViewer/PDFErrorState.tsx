
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PDFErrorStateProps {
  error: string;
}

const PDFErrorState = ({ error }: PDFErrorStateProps) => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading PDF</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFErrorState;
