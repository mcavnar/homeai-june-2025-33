
import { pdfjsLib } from './pdfConfig';

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  error?: string;
}

export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<PDFExtractionResult> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      
      // Report progress
      if (onProgress) {
        onProgress((pageNum / pageCount) * 100);
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
