
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PDFLoadingState = () => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFLoadingState;
