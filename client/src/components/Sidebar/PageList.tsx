import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageStore } from '../../store/pageStore';
import { getPages, deletePage } from '../../api/client';
import { PageSummary } from '../../../../shared/types';

export function PageList() {
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();
  const { pages, setPages, addToast } = usePageStore((s) => ({
    pages: s.pages,
    setPages: s.setPages,
    addToast: s.addToast,
  }));

  useEffect(() => {
    getPages().then((r) => setPages(r.data)).catch(() => {});
  }, [setPages]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Delete this page?')) return;
    try {
      await deletePage(id);
      setPages(pages.filter((p) => p.id !== id));
      if (pageId === id) navigate('/');
      addToast('Page deleted', 'success');
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  const sidebarStyle: React.CSSProperties = {
    width: '240px',
    minWidth: '240px',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    background: 'var(--surface)',
  };

  return (
    <div style={sidebarStyle}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Pages ({pages.length})
        </span>
        <button className="btn btn-primary" onClick={() => navigate('/')}>+ New</button>
      </div>

      <div style={{ flex: 1 }}>
        {pages.length === 0 && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', padding: '1rem', textAlign: 'center' }}>
            No pages yet
          </p>
        )}
        {pages.map((p: PageSummary) => (
          <div
            key={p.id}
            onClick={() => navigate(`/editor/${p.id}`)}
            style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              background: p.id === pageId ? 'rgba(244,197,66,0.06)' : 'transparent',
              borderLeft: p.id === pageId ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.title}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                {new Date(p.updatedAt).toLocaleDateString()}
              </div>
              {p.sourceFilename && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.sourceFilename}
                </div>
              )}
            </div>
            <button
              className="btn btn-danger"
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', flexShrink: 0 }}
              onClick={(e) => handleDelete(e, p.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
