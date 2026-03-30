import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
}

const ICONS: Record<string, string> = {
  success: '✓',
  error: '✗',
  info: 'i',
};

function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}${toast.exiting ? ' exiting' : ''}`}
        >
          <span>{ICONS[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;