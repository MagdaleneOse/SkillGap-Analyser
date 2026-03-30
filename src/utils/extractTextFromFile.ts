import type { PDFDocumentProxy } from 'pdfjs-dist';

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'text/plain': '.txt',
};

export const ACCEPTED_EXTENSIONS = '.pdf,.docx,.txt';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`;
  }

  const acceptedMimeTypes = Object.keys(ACCEPTED_FILE_TYPES);
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  const isValidMime = acceptedMimeTypes.includes(file.type);
  const isValidExtension = ['pdf', 'docx', 'txt'].includes(fileExtension ?? '');

  if (!isValidMime && !isValidExtension) {
    return 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.';
  }

  return null;
}

async function extractFromPdf(file: File): Promise<string> {
  try {
    const [{ pdfjsLib }] = await Promise.all([import('../lib/pdfWorker')]);

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      stopAtErrors: false,
    });

    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const pages: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: unknown) => {
          if (typeof item === 'object' && item !== null && 'str' in item) {
            return String((item as { str: string }).str);
          }
          return '';
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (pageText) {
        pages.push(pageText);
      }
    }

    const fullText = pages.join('\n\n').trim();

    if (!fullText) {
      throw new Error(
        'No readable text was found in this PDF. It may be scanned, image-based, password-protected, or use embedded fonts that prevent extraction.'
      );
    }

    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(
      'Could not extract readable text from this PDF. Try uploading a DOCX or TXT file, or paste your CV text manually.'
    );
  }
}

async function extractFromDocx(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages.length > 0) {
      console.warn('Mammoth warnings:', result.messages);
    }

    const text = result.value.trim();

    if (!text) {
      throw new Error('No readable text was found in this DOCX file.');
    }

    return text;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(
      'Could not extract readable text from this DOCX file. Try saving it again as .docx or paste the CV text manually.'
    );
  }
}

function extractFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = (e.target?.result as string).trim();

      if (!text) {
        reject(new Error('The text file is empty.'));
        return;
      }

      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read text file.'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  const isPdf = file.type === 'application/pdf' || fileExtension === 'pdf';
  const isDocx =
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileExtension === 'docx';
  const isTxt = file.type === 'text/plain' || fileExtension === 'txt';

  if (isPdf) return extractFromPdf(file);
  if (isDocx) return extractFromDocx(file);
  if (isTxt) return extractFromTxt(file);

  throw new Error(
    'Unsupported file format. Please upload a PDF, DOCX, or TXT file.'
  );
}