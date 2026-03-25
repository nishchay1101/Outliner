import { useEffect } from 'react';
import { usePageStore } from '../../store/pageStore';
import './Toast.css';

export function Toast() {
  const { toasts, removeToast } = usePageStore((s) => ({
    toasts: s.toasts,
    removeToast: s.removeToast,
  }));

  useEffect(() => {
    toasts.forEach((t) => {
      const timer = setTimeout(() => removeToast(t.id), 3500);
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`fade-up toast-item toast-item-${t.type || 'info'}`}
          onClick={() => removeToast(t.id)}
        >
          {t.type === 'error' ? '✗ ' : t.type === 'success' ? '✓ ' : '→ '}{t.message}
        </div>
      ))}
    </div>
  );
}
