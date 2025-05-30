
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessingStatusProps {
  isProcessing: boolean;
  extractionProgress: number;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  extractionProgress,
}) => {
  if (!isProcessing) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <div className="text-center">
            <p className="font-medium text-gray-900">
              {extractionProgress > 0 ? `Extracting text... ${Math.round(extractionProgress)}%` : 'Analyzing your home inspection report with AI...'}
            </p>
            <p className="text-sm text-gray-600">
              {extractionProgress > 0 ? 'Reading PDF content' : 'Generating comprehensive insights and cost estimates'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;
