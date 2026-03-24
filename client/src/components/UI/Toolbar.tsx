import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageStore } from '../../store/pageStore';
import { usePageEditor } from '../../hooks/usePageEditor';
import { exportPage, updatePage } from '../../api/client';

interface Props {
  onToggleAddBlock: () => void;
  onToggleExtend: () => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export function Toolbar({ onToggleAddBlock, onToggleExtend, showSidebar, onToggleSidebar }: Props) {
  const navigate = useNavigate();
  const { activePage, editMode, toggleEditMode, updateActivePageTitle, addToast } = usePageStore((s) => ({
    activePage: s.activePage,
    editMode: s.editMode,
    toggleEditMode: s.toggleEditMode,
    updateActivePageTitle: s.updateActivePageTitle,
    addToast: s.addToast,
  }));
  const { save } = usePageEditor();
  const [editingTitle, setEditingTitle] = useState(false);

  const handleExport = async () => {
    if (!activePage) return;
    try {
      const res = await exportPage(activePage.id);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activePage.title.replace(/[^a-z0-9]/gi, '_')}.html`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Exported!', 'success');
    } catch {
      addToast('Export failed', 'error');
    }
  };

  const handleTitleSave = async (newTitle: string) => {
    if (!activePage) return;
    updateActivePageTitle(newTitle);
    setEditingTitle(false);
    try {
      await updatePage(activePage.id, { title: newTitle });
    } catch {
      addToast('Failed to update title', 'error');
    }
  };

  const toolbarStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    padding: '0.6rem 1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.75rem',
  };

  return (
    <div style={toolbarStyle}>
      <button className="btn btn-ghost" style={{ marginRight: '0.25rem' }} onClick={onToggleSidebar}>
        {showSidebar ? '◀' : '▶'} Pages
      </button>

      <button className="btn btn-ghost" onClick={() => navigate('/')}>
        ↩ Home
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={activePage?.title}
            style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1rem', width: '320px' }}
            onBlur={(e) => handleTitleSave(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave((e.target as HTMLInputElement).value); }}
          />
        ) : (
          <span
            onClick={() => setEditingTitle(true)}
            style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1rem', cursor: 'text', color: 'var(--text)', padding: '0.2rem 0.4rem', borderRadius: '2px' }}
          >
            {activePage?.title || 'Untitled'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button className={`btn ${editMode ? 'btn-primary' : 'btn-ghost'}`} onClick={toggleEditMode}>
          {editMode ? '✏️ Editing' : '✏️ Edit'}
        </button>
        {editMode && (
          <>
            <button className="btn btn-ghost" onClick={onToggleAddBlock}>+ Block</button>
            <button className="btn btn-ghost" style={{ color: 'var(--accent3)' }} onClick={onToggleExtend}>✨ Extend</button>
          </>
        )}
        <button className="btn btn-ghost" onClick={handleExport}>⬇ Export</button>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </div>
    </div>
  );
}
