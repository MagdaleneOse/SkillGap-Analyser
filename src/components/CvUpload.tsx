import {
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
  type DragEvent,
  type CSSProperties,
} from 'react';
import {
  extractTextFromFile,
  validateFile,
  ACCEPTED_EXTENSIONS,
} from '../utils/extractTextFromFile';

interface Props {
  onTextExtracted: (text: string) => void;
}

type UploadStatus = 'idle' | 'processing' | 'success' | 'error';

export default function CvUpload({ onTextExtracted }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setStatus('processing');
      setFileName(file.name);

      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        setStatus('error');
        return;
      }

      try {
        const extractedText = await extractTextFromFile(file);

        if (!extractedText || extractedText.trim().length < 50) {
          throw new Error(
            'Extracted text is too short. The file may be image-based or password-protected. Try copying and pasting your CV text instead.'
          );
        }

        onTextExtracted(extractedText);
        setStatus('success');
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Extraction failed. Please try again.';
        setErrorMessage(message);
        setStatus('error');
      }
    },
    [onTextExtracted]
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (status !== 'processing') {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (status === 'processing') return;

    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const statusConfig = {
    idle: {
      borderColor: '#cbd5e0',
      backgroundColor: '#f7fafc',
      icon: '📄',
      message: 'Drag and drop your CV here, or click to browse',
    },
    processing: {
      borderColor: '#4f46e5',
      backgroundColor: '#ebf4ff',
      icon: '⏳',
      message: `Reading ${fileName ?? 'file'}...`,
    },
    success: {
      borderColor: '#38a169',
      backgroundColor: '#f0fff4',
      icon: '✅',
      message: `${fileName} — text extracted successfully`,
    },
    error: {
      borderColor: '#e53e3e',
      backgroundColor: '#fff5f5',
      icon: '❌',
      message: errorMessage ?? 'An error occurred.',
    },
  } as const;

  const current = statusConfig[status];

  return (
    <div style={styles.wrapper}>
      <div
        onClick={() => {
          if (status !== 'processing') {
            fileInputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          ...styles.dropZone,
          borderColor: isDragOver ? '#4f46e5' : current.borderColor,
          backgroundColor: isDragOver ? '#ebf4ff' : current.backgroundColor,
          cursor: status === 'processing' ? 'wait' : 'pointer',
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload CV file"
      >
        <span style={styles.icon}>{current.icon}</span>
        <p style={styles.message}>{current.message}</p>

        {status !== 'processing' && (
          <p style={styles.hint}>Accepted formats: PDF, DOCX, TXT · Max 5MB</p>
        )}

        {(status === 'error' || status === 'success') && (
          <span style={styles.retryLink}>Upload a different file</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={styles.separator}>
        <hr style={styles.line} />
        <span style={styles.orText}>or paste text below</span>
        <hr style={styles.line} />
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  dropZone: {
    border: '2px dashed',
    borderRadius: '10px',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    transition: 'border-color 0.2s, background-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '2rem',
  },
  message: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#2d3748',
  },
  hint: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#a0aec0',
  },
  retryLink: {
    fontSize: '0.8rem',
    color: '#4f46e5',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  line: {
    flex: 1,
    border: 'none',
    borderTop: '1px solid #e2e8f0',
  },
  orText: {
    fontSize: '0.8rem',
    color: '#a0aec0',
    whiteSpace: 'nowrap',
  },
};