import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageStore } from '../store/pageStore';
import { getPage } from '../api/client';
import { Toolbar } from '../components/UI/Toolbar';
import { PageList } from '../components/Sidebar/PageList';
import { PageRenderer } from '../components/Renderer/PageRenderer';
import { AddBlockPanel } from '../components/Editor/AddBlockPanel';
import { ExtendPanel } from '../components/Editor/ExtendPanel';

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
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Loading page...</div>
      </div>
    );
  }

  if (!activePage) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--accent2)' }}>Page not found</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        onToggleAddBlock={() => { setShowAddBlock((v) => !v); setShowExtend(false); }}
        onToggleExtend={() => { setShowExtend((v) => !v); setShowAddBlock(false); }}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar((v) => !v)}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {showSidebar && <PageList />}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <PageRenderer />
          </div>
        </main>
        {showAddBlock && <AddBlockPanel onClose={() => setShowAddBlock(false)} />}
        {showExtend && <ExtendPanel onClose={() => setShowExtend(false)} />}
      </div>
    </div>
  );
}
