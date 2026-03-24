import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageStore } from '../../store/pageStore';
import { usePageEditor } from '../../hooks/usePageEditor';
import { exportPage, updatePage } from '../../api/client';
import './Toolbar.css';

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

  return (
    <div className="toolbar-container">
      <button className="btn btn-ghost toolbar-sidebar-toggle-btn" onClick={onToggleSidebar}>
        {showSidebar ? '◀' : '▶'} Pages
      </button>

      <button className="btn btn-ghost" onClick={() => navigate('/')}>
        ↩ Home
      </button>

      <div className="toolbar-title-wrapper">
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={activePage?.title}
            className="toolbar-title-input"
            onBlur={(e) => handleTitleSave(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave((e.target as HTMLInputElement).value); }}
          />
        ) : (
          <span
            onClick={() => setEditingTitle(true)}
            className="toolbar-title-display"
          >
            {activePage?.title || 'Untitled'}
          </span>
        )}
      </div>

      <div className="toolbar-actions">
        <button className={`btn ${editMode ? 'btn-primary' : 'btn-ghost'}`} onClick={toggleEditMode}>
          {editMode ? '✏️ Editing' : '✏️ Edit'}
        </button>
        {editMode && (
          <>
            <button className="btn btn-ghost" onClick={onToggleAddBlock}>+ Block</button>
            <button className="btn btn-ghost toolbar-extend-btn" onClick={onToggleExtend}>✨ Extend</button>
          </>
        )}
        <button className="btn btn-ghost" onClick={handleExport}>⬇ Export</button>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </div>
    </div>
  );
}
