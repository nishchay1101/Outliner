import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageStore } from '../store/pageStore';
import { getPage } from '../api/client';
import { PageRenderer } from '../components/Renderer/PageRenderer';
import './View.css';

export default function View() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { setActivePage } = usePageStore((s) => ({ setActivePage: s.setActivePage }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pageId) return;
    getPage(pageId).then((r) => setActivePage(r.data)).finally(() => setLoading(false));
  }, [pageId, setActivePage]);

  if (loading) return <div className="view-loading-text">Loading...</div>;

  return (
    <div className="view-layout">
      <div className="view-canvas-max-width">
        <button className="btn btn-ghost view-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <PageRenderer />
      </div>
    </div>
  );
}
