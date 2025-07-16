
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PDFLoadingStateProps {
  message?: string;
  subMessage?: string;
}

const PDFLoadingState = ({ 
  message = "Loading PDF...", 
  subMessage = "Please wait while we prepare your document" 
}: PDFLoadingStateProps) => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">{message}</p>
          <p className="text-gray-400 text-sm">{subMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFLoadingState;
