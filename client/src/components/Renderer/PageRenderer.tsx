import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { usePageStore } from '../../store/pageStore';
import { usePageEditor } from '../../hooks/usePageEditor';
import { updatePage } from '../../api/client';
import { Block } from '../../../../shared/types';
import { HeroBlock } from './blocks/HeroBlock';
import { SectionBlock } from './blocks/SectionBlock';
import { TipBlock } from './blocks/TipBlock';
import { TableBlock } from './blocks/TableBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { ChecklistBlock } from './blocks/ChecklistBlock';
import { ExerciseBlock } from './blocks/ExerciseBlock';
import { TimelineBlock } from './blocks/TimelineBlock';
import { ProblemBlock } from './blocks/ProblemBlock';
import { DividerBlock } from './blocks/DividerBlock';

function renderBlock(block: Block, editMode: boolean, isEditing: boolean, onUpdate: (data: Record<string, any>) => void) {
  const props = { data: block.data, editMode: isEditing, onUpdate };
  switch (block.type) {
    case 'hero': return <HeroBlock {...props} data={block.data as any} />;
    case 'section': return <SectionBlock {...props} data={block.data as any} />;
    case 'tip': return <TipBlock {...props} data={block.data as any} />;
    case 'table': return <TableBlock {...props} data={block.data as any} />;
    case 'code': return <CodeBlock {...props} data={block.data as any} />;
    case 'checklist': return <ChecklistBlock {...props} data={block.data as any} />;
    case 'exercise': return <ExerciseBlock {...props} data={block.data as any} />;
    case 'timeline': return <TimelineBlock {...props} data={block.data as any} />;
    case 'problem': return <ProblemBlock {...props} data={block.data as any} />;
    case 'divider': return <DividerBlock {...props} data={block.data as any} />;
    default: return <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>Unknown block type: {block.type}</div>;
  }
}

export function PageRenderer() {
  const { activePage, editMode, editingBlockId, setEditingBlockId, deleteBlock, reorderBlocks, updateBlock, addToast } = usePageStore((s) => ({
    activePage: s.activePage,
    editMode: s.editMode,
    editingBlockId: s.editingBlockId,
    setEditingBlockId: s.setEditingBlockId,
    deleteBlock: s.deleteBlock,
    reorderBlocks: s.reorderBlocks,
    updateBlock: s.updateBlock,
    addToast: s.addToast,
  }));
  const { saveBlock } = usePageEditor();

  if (!activePage) return null;

  const sorted = [...activePage.blocks].sort((a, b) => a.order - b.order);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(sorted);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const reordered = items.map((b, i) => ({ ...b, order: i }));
    reorderBlocks(reordered);
    try {
      await updatePage(activePage.id, { blocks: reordered });
    } catch {
      addToast('Failed to reorder blocks', 'error');
    }
  };

  const handleUpdate = async (block: Block, data: Record<string, any>) => {
    await saveBlock(block.id, data);
    setEditingBlockId(null);
  };

  const handleDelete = (blockId: string) => {
    if (!confirm('Delete this block?')) return;
    deleteBlock(blockId);
    const newBlocks = activePage.blocks.filter(b => b.id !== blockId).map((b, i) => ({ ...b, order: i }));
    updatePage(activePage.id, { blocks: newBlocks }).catch(() => addToast('Failed to delete block', 'error'));
  };

  return (
    <div className="lecture-canvas">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="page-blocks" isDropDisabled={!editMode}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sorted.map((block, index) => {
                const isEditing = editingBlockId === block.id;
                return (
                  <Draggable key={block.id} draggableId={block.id} index={index} isDragDisabled={!editMode}>
                    {(drag) => (
                      <div ref={drag.innerRef} {...drag.draggableProps} className="fade-up" style={{ ...drag.draggableProps.style, marginBottom: '1.25rem', position: 'relative' }}>
                        {editMode && (
                          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10, display: 'flex', gap: '0.35rem' }} className="lecture-canvas-edit-icons">
                            {!isEditing && (
                              <>
                                <span {...drag.dragHandleProps} style={{ cursor: 'grab', padding: '0.2rem 0.4rem', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-dim)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2px' }}>⣿</span>
                                <button className="btn btn-ghost" style={{ padding: '0.2rem 0.45rem', fontSize: '0.65rem' }} onClick={() => setEditingBlockId(block.id)}>✏️</button>
                                <button className="btn btn-danger" style={{ padding: '0.2rem 0.45rem', fontSize: '0.65rem' }} onClick={() => handleDelete(block.id)}>🗑</button>
                              </>
                            )}
                            {isEditing && (
                              <button className="btn btn-ghost" style={{ padding: '0.2rem 0.45rem', fontSize: '0.65rem' }} onClick={() => setEditingBlockId(null)}>✕ Cancel</button>
                            )}
                          </div>
                        )}
                        {renderBlock(block, editMode, isEditing, (data) => handleUpdate(block, data))}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
