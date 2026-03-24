import { ReactNode } from 'react';
import { usePageStore } from '../../../store/pageStore';

interface Props {
  blockId: string;
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export function BlockWrapper({ blockId, children, onEdit, onDelete }: Props) {
  const { editMode, editingBlockId } = usePageStore((s) => ({
    editMode: s.editMode,
    editingBlockId: s.editingBlockId,
  }));

  const isEditing = editingBlockId === blockId;

  return (
    <div
      className="fade-up"
      style={{
        position: 'relative',
        marginBottom: '1.25rem',
        outline: editMode && !isEditing ? '1px dashed transparent' : isEditing ? '1px solid var(--accent)' : 'none',
        borderRadius: '4px',
        transition: 'outline 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (editMode && !isEditing) {
          (e.currentTarget as HTMLDivElement).style.outline = '1px dashed var(--border)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isEditing) {
          (e.currentTarget as HTMLDivElement).style.outline = editMode ? '1px dashed transparent' : 'none';
        }
      }}
    >
      {children}
      {editMode && !isEditing && (
        <div style={{
          position: 'absolute', top: '0.5rem', right: '0.5rem',
          display: 'flex', gap: '0.35rem', opacity: 0, transition: 'opacity 0.15s',
        }}
          className="block-controls"
        >
          <button className="btn btn-ghost" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }} onClick={onEdit}>✏️</button>
          <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }} onClick={onDelete}>🗑</button>
        </div>
      )}
    </div>
  );
}
