
import React, { useRef } from 'react';
import { Upload, FileText, Loader2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FileUploadSectionProps {
  file: File | null;
  isProcessing: boolean;
  overallProgress: number;
  phaseMessage: string;
  error: string;
  onFileSelect: (file: File) => void;
  onProcess: () => void;
  onReset: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  isProcessing,
  overallProgress,
  phaseMessage,
  error,
  onFileSelect,
  onProcess,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Home Inspection Report
        </CardTitle>
        <CardDescription>
          Select or drag & drop a PDF file (max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-12 w-12 text-blue-500" />
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-gray-600">Click to select or drag & drop your home inspection PDF</p>
              <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
            </div>
          )}
        </div>

        {/* Processing Time Notice */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Please be patient during analysis</p>
              <p>Our AI thoroughly analyzes your inspection report, which can take 1-2 minutes to complete. We're extracting key findings, estimating repair costs, and generating insights to help you make informed decisions.</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 mt-4">
          <Button
            onClick={onProcess}
            disabled={!file || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {phaseMessage} {Math.round(overallProgress)}%
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Analyze Home Inspection Report
              </>
            )}
          </Button>
          
          {file && (
            <Button onClick={onReset} variant="outline">
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
