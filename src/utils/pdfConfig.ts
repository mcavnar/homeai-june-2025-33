
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Set up the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

export { pdfjsLib };
