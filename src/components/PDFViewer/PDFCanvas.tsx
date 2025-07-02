
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PDFCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const PDFCanvas = ({ canvasRef }: PDFCanvasProps) => {
  return (
    <ScrollArea className="h-[700px] w-full">
      <div className="flex justify-center p-6 bg-gray-100 min-h-full">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border shadow-lg bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default PDFCanvas;
