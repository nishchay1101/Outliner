import { useEffect } from 'react';
import { usePageStore } from '../../store/pageStore';

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
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="fade-up"
          onClick={() => removeToast(t.id)}
          style={{
            background: t.type === 'error' ? 'rgba(224,92,92,0.15)' : t.type === 'success' ? 'rgba(92,244,180,0.15)' : 'var(--surface)',
            border: `1px solid ${t.type === 'error' ? 'var(--accent2)' : t.type === 'success' ? 'var(--accent3)' : 'var(--border)'}`,
            color: t.type === 'error' ? 'var(--accent2)' : t.type === 'success' ? 'var(--accent3)' : 'var(--text)',
            fontFamily: 'var(--mono)',
            fontSize: '0.75rem',
            padding: '0.6rem 1rem',
            borderRadius: '2px',
            cursor: 'pointer',
            maxWidth: '320px',
            backdropFilter: 'blur(8px)',
          }}
        >
          {t.type === 'error' ? '✗ ' : t.type === 'success' ? '✓ ' : '→ '}{t.message}
        </div>
      ))}
    </div>
  );
}
