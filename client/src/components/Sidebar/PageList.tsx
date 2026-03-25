import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageStore } from '../../store/pageStore';
import { getPages, deletePage } from '../../api/client';
import { PageSummary } from '../../../../shared/types';
import './PageList.css';

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

  return (
    <div className="page-list-sidebar">
      <div className="page-list-header">
        <span className="page-list-count-label">
          Pages ({pages.length})
        </span>
        <button className="btn btn-primary" onClick={() => navigate('/')}>+ New</button>
      </div>

      <div className="page-list-body">
        {pages.length === 0 && (
          <p className="page-list-empty-msg">
            No pages yet
          </p>
        )}
        {pages.map((p: PageSummary) => (
          <div
            key={p.id}
            onClick={() => navigate(`/editor/${p.id}`)}
            className={`page-list-item ${p.id === pageId ? 'selected' : ''}`}
          >
            <div className="page-list-item-content">
              <div className="page-list-item-title">
                {p.title}
              </div>
              <div className="page-list-item-date">
                {new Date(p.updatedAt).toLocaleDateString()}
              </div>
              {p.sourceFilename && (
                <div className="page-list-item-source">
                  {p.sourceFilename}
                </div>
              )}
            </div>
            <button
              className="btn btn-danger page-list-delete-btn"
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
