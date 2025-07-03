
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  isProcessing: boolean;
  overallProgress: number;
  phaseMessage: string;
  estimatedTimeRemaining: string | null;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  overallProgress,
  phaseMessage,
  estimatedTimeRemaining,
}) => {
  if (!isProcessing) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {phaseMessage} {Math.round(overallProgress)}%
              </p>
              {estimatedTimeRemaining && (
                <p className="text-sm text-gray-600 mt-1">
                  {estimatedTimeRemaining}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={overallProgress} className="w-full h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;
