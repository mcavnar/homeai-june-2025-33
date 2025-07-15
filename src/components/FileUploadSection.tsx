
import React, { useRef } from 'react';
import { Upload, FileText, Loader2, Zap } from 'lucide-react';
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
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-100">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900">
          <Upload className="h-6 w-6 text-green-600" />
          Upload Your Home Inspection Report
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Get your personalized analysis in under 2 minutes • PDF files up to 10MB
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
            file 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
          }`}
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                </p>
              </div>
              <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                ✓ File validated
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-700 font-medium text-lg mb-2">
                  Drag & drop your inspection report here
                </p>
                <p className="text-gray-500 text-sm">or click to browse files</p>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                PDF files only • Maximum 10MB
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
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {phaseMessage} {Math.round(overallProgress)}%
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Get My FREE Analysis
              </>
            )}
          </Button>
          
          {file && (
            <Button 
              onClick={onReset} 
              variant="outline"
              className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 rounded-lg"
            >
              Change File
            </Button>
          )}
        </div>

        {/* What happens next */}
        {file && !isProcessing && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">What happens next:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI analyzes your entire inspection report</li>
              <li>• Calculates exact repair costs for your area</li>
              <li>• Generates negotiation strategies</li>
              <li>• Creates your personalized report</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
