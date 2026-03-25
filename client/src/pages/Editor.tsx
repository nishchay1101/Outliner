import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../store/pageStore';
import { getPage } from '../api/client';
import { Toolbar } from '../components/UI/Toolbar';
import { PageList } from '../components/Sidebar/PageList';
import { PageRenderer } from '../components/Renderer/PageRenderer';
import { AddBlockPanel } from '../components/Editor/AddBlockPanel';
import { ExtendPanel } from '../components/Editor/ExtendPanel';
import './Editor.css';

export default function Editor() {
  const { pageId } = useParams<{ pageId: string }>();
  const { setActivePage, activePage, addToast } = usePageStore((s) => ({
    setActivePage: s.setActivePage,
    activePage: s.activePage,
    addToast: s.addToast,
  }));

  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showExtend, setShowExtend] = useState(false);

  useEffect(() => {
    if (!pageId) return;
    setLoading(true);
    getPage(pageId)
      .then((r) => setActivePage(r.data))
      .catch(() => addToast('Failed to load page', 'error'))
      .finally(() => setLoading(false));
  }, [pageId, setActivePage, addToast]);

  if (loading) {
    return (
      <div className="editor-loading-container">
        <div className="editor-loading-text">Loading page...</div>
      </div>
    );
  }

  if (!activePage) {
    return (
      <div className="editor-loading-container">
        <div className="editor-error-text">Page not found</div>
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <Toolbar
        onToggleAddBlock={() => { setShowAddBlock((v) => !v); setShowExtend(false); }}
        onToggleExtend={() => { setShowExtend((v) => !v); setShowAddBlock(false); }}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar((v) => !v)}
      />
      <div className="editor-content-area">
        {showSidebar && <PageList />}
        <main className="editor-main">
          <div className="editor-canvas-max-width">
            <PageRenderer />
          </div>
        </main>
        {showAddBlock && <AddBlockPanel onClose={() => setShowAddBlock(false)} />}
        {showExtend && <ExtendPanel onClose={() => setShowExtend(false)} />}
      </div>
    </div>
  );
}
