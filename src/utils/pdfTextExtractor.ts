
import { pdfjsLib } from './pdfConfig';

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  error?: string;
}

const simulateProgress = (
  startPercent: number,
  endPercent: number,
  durationMs: number,
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const progressRange = endPercent - startPercent;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Use easing for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const currentPercent = startPercent + (progressRange * easedProgress);
      
      onProgress(currentPercent);
      
      if (progress >= 1) {
        clearInterval(interval);
        onProgress(endPercent);
        resolve();
      }
    }, 100); // Update every 100ms
  });
};

export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<PDFExtractionResult> => {
  try {
    // Phase 1: Simulate file loading progress (0% -> 5%)
    if (onProgress) {
      await simulateProgress(0, 5, 1500, onProgress); // 1.5 seconds
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Phase 2: Simulate PDF parsing progress (5% -> 15%)
    if (onProgress) {
      await simulateProgress(5, 15, 2000, onProgress); // 2 seconds
    }
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    
    let fullText = '';
    
    // Phase 3: Real page extraction progress (15% -> 100%)
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      
      // Report progress mapped to 15-100% range
      if (onProgress) {
        const pageProgress = (pageNum / pageCount) * 85; // 85% of remaining progress
        onProgress(15 + pageProgress);
      }
    }
    
    return {
      text: fullText.trim(),
      pageCount,
    };
    
  } catch (error) {
    console.error('PDF text extraction error:', error);
    return {
      text: '',
      pageCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
