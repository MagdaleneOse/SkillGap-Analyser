import { pdfjsLib } from '../lib/pdfWorker'
import * as mammoth from 'mammoth'

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
}

export const ACCEPTED_EXTENSIONS = '.pdf,.docx,.txt'

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`
  }

  const acceptedMimeTypes = Object.keys(ACCEPTED_FILE_TYPES)
  const fileExtension = file.name.split('.').pop()?.toLowerCase()

  const isValidMime = acceptedMimeTypes.includes(file.type)
  const isValidExtension = ['pdf', 'docx', 'txt'].includes(fileExtension ?? '')

  if (!isValidMime && !isValidExtension) {
    return 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.'
  }

  return null
}

async function extractFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useWorkerFetch: false,
    isEvalSupported: false,
  })

  const pdf = await loadingTask.promise
  const pages: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    const pageText = textContent.items
      .map((item: unknown) => {
        if (typeof item === 'object' && item !== null && 'str' in item) {
          return String((item as { str: string }).str)
        }
        return ''
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    pages.push(pageText)
  }

  return pages.join('\n\n').trim()
}

async function extractFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })

  if (result.messages.length > 0) {
    console.warn('Mammoth warnings:', result.messages)
  }

  return result.value.trim()
}

function extractFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      resolve((e.target?.result as string).trim())
    }

    reader.onerror = () => {
      reject(new Error('Failed to read text file.'))
    }

    reader.readAsText(file, 'UTF-8')
  })
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()

  const isPdf = file.type === 'application/pdf' || fileExtension === 'pdf'
  const isDocx =
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileExtension === 'docx'
  const isTxt = file.type === 'text/plain' || fileExtension === 'txt'

  if (isPdf) return extractFromPdf(file)
  if (isDocx) return extractFromDocx(file)
  if (isTxt) return extractFromTxt(file)

  throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.')
}