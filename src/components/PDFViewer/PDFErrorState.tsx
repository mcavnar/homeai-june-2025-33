
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const PDFErrorState = ({ error, onRetry }: PDFErrorStateProps) => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Loading Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-4">
            This could be due to a network issue or corrupted file. Please try again.
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFErrorState;
