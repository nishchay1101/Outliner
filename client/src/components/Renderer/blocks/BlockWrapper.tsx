import { ReactNode } from 'react';
import { usePageStore } from '../../../store/pageStore';
import './BlockWrapper.css';

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
      className={`fade-up block-wrapper-main ${editMode ? 'edit-mode' : ''} ${isEditing ? 'editing' : ''}`}
    >
      {children}
      {editMode && !isEditing && (
        <div className="block-wrapper-controls">
          <button className="btn btn-ghost block-wrapper-btn" onClick={onEdit}>✏️</button>
          <button className="btn btn-danger block-wrapper-btn" onClick={onDelete}>🗑</button>
        </div>
      )}
    </div>
  );
}
