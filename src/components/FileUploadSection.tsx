
import React, { useRef } from 'react';
import { Upload, FileText, Loader2, Zap, Home } from 'lucide-react';
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
    <Card className="shadow-lg border-2 border-gray-200 hover:border-green-300 transition-colors">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <Home className="h-6 w-6 text-green-600" />
          Upload Your Inspection Report
        </CardTitle>
        <CardDescription className="text-base">
          Get instant analysis in under 2 minutes • PDF files up to 10MB
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer group"
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
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
                <p className="text-green-600 font-medium">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-green-100 rounded-full group-hover:from-green-100 group-hover:to-blue-100 transition-all">
                <Upload className="h-10 w-10 text-blue-600 group-hover:text-green-600 transition-colors" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-lg mb-2">
                  Click here or drag & drop your inspection PDF
                </p>
                <p className="text-gray-500">
                  We support all standard inspection report formats
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onProcess}
            disabled={!file || isProcessing}
            className="flex-1 h-12 text-base font-semibold bg-green-600 hover:bg-green-700 border-2 border-green-700 hover:border-green-800 shadow-lg hover:shadow-xl transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {phaseMessage} {Math.round(overallProgress)}%
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Get My Free Analysis
              </>
            )}
          </Button>
          
          {file && !isProcessing && (
            <Button onClick={onReset} variant="outline" className="h-12">
              Choose Different File
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
