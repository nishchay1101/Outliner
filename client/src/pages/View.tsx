import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageStore } from '../store/pageStore';
import { getPage } from '../api/client';
import { PageRenderer } from '../components/Renderer/PageRenderer';

export default function View() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { setActivePage } = usePageStore((s) => ({ setActivePage: s.setActivePage }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pageId) return;
    getPage(pageId).then((r) => setActivePage(r.data)).finally(() => setLoading(false));
  }, [pageId, setActivePage]);

  if (loading) return <div style={{ padding: '2rem', fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>← Back</button>
        <PageRenderer />
      </div>
    </div>
  );
}
