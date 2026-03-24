import { v4 as uuidv4 } from 'uuid';
import { BlockType, Block } from '../../../../shared/types';
import { usePageStore } from '../../store/pageStore';
import { updatePage } from '../../api/client';
import './AddBlockPanel.css';

interface Props { onClose: () => void; }

const BLOCK_TYPES: { type: BlockType; icon: string; label: string; description: string; defaultData: Record<string, any> }[] = [
  { type: 'section', icon: '📝', label: 'Section', description: 'Titled section with body text', defaultData: { title: 'New Section', content: 'Enter content here...' } },
  { type: 'tip', icon: '💡', label: 'Tip / Callout', description: 'Highlighted note or warning', defaultData: { label: 'Tip', content: 'Enter tip content here...' } },
  { type: 'checklist', icon: '✅', label: 'Checklist', description: 'Bullet list of items', defaultData: { title: 'Checklist', items: ['First item', 'Second item'] } },
  { type: 'table', icon: '📊', label: 'Table', description: 'Data or dry-run table', defaultData: { headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['Row 1', 'Data', 'Data'], ['Row 2', 'Data', 'Data']] } },
  { type: 'code', icon: '💻', label: 'Code Block', description: 'Pseudocode or algorithm', defaultData: { title: 'Algorithm', lines: [{ text: 'function example():', indent: 0, type: 'keyword' }, { text: 'return result', indent: 1, type: 'keyword' }] } },
  { type: 'problem', icon: '🧩', label: 'Problem', description: 'Coding problem card', defaultData: { number: 1, title: 'Problem Title', timeMin: 20, link: '', platform: 'LeetCode', steps: [{ num: 1, text: 'Understand the problem' }], dryRun: [], insights: [], warnings: [], complexity: { time: 'O(n)', space: 'O(1)' } } },
  { type: 'exercise', icon: '🏋️', label: 'Exercise', description: 'Homework or practice cards', defaultData: { title: 'Exercises', items: [{ badge: 'Easy', text: 'Exercise description' }] } },
  { type: 'timeline', icon: '⏱', label: 'Timeline', description: 'Time-segment bar', defaultData: { segments: [{ time: '0–5 min', label: 'Intro', active: true }, { time: '5–15 min', label: 'Core', active: false }] } },
  { type: 'hero', icon: '🦸', label: 'Hero', description: 'Large title + subtitle', defaultData: { title: 'Title', subtitle: 'Subtitle', badges: [], metaChips: [] } },
  { type: 'divider', icon: '➖', label: 'Divider', description: 'Visual separator', defaultData: { style: 'gradient' } },
];

export function AddBlockPanel({ onClose }: Props) {
  const { activePage, addBlock, addToast, setEditingBlockId, setEditMode } = usePageStore((s) => ({
    activePage: s.activePage,
    addBlock: s.addBlock,
    addToast: s.addToast,
    setEditingBlockId: s.setEditingBlockId,
    setEditMode: s.setEditMode,
  }));

  const handleAdd = async (bt: typeof BLOCK_TYPES[0]) => {
    if (!activePage) return;
    const newBlock: Block = {
      id: uuidv4(),
      type: bt.type,
      data: bt.defaultData,
      order: activePage.blocks.length,
    };
    addBlock(newBlock);
    setEditMode(true);
    setEditingBlockId(newBlock.id);
    const updatedBlocks = [...activePage.blocks, newBlock].map((b, i) => ({ ...b, order: i }));
    try {
      await updatePage(activePage.id, { blocks: updatedBlocks });
      addToast(`${bt.label} block added`, 'success');
    } catch {
      addToast('Failed to add block', 'error');
    }
    onClose();
  };

  return (
    <div className="add-block-panel">
      <div className="add-block-header">
        <span className="add-block-title">Add Block</span>
        <button className="btn btn-ghost add-block-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="add-block-list">
        {BLOCK_TYPES.map((bt) => (
          <button
            key={bt.type}
            onClick={() => handleAdd(bt)}
            className="add-block-item-btn"
          >
            <span className="add-block-item-icon">{bt.icon}</span>
            <div>
              <div className="add-block-item-label">{bt.label}</div>
              <div className="add-block-item-desc">{bt.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
