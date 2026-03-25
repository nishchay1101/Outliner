import { useState } from 'react';
import { usePageStore } from '../../store/pageStore';
import { extendWithAI, updatePage } from '../../api/client';
import { v4 as uuidv4 } from 'uuid';
import './ExtendPanel.css';

interface Props { onClose: () => void; }

export function ExtendPanel({ onClose }: Props) {
  const { activePage, addBlock, setEditingBlockId, setEditMode, addToast } = usePageStore((s) => ({
    activePage: s.activePage,
    addBlock: s.addBlock,
    setEditingBlockId: s.setEditingBlockId,
    setEditMode: s.setEditMode,
    addToast: s.addToast,
  }));
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const getContextBlocks = () => {
    if (!activePage) return [];
    const sorted = [...activePage.blocks].sort((a, b) => a.order - b.order);
    return sorted.slice(-3);
  };

  const handleExtend = async () => {
    if (!prompt.trim() || !activePage) return;
    setLoading(true);
    try {
      const contextBlocks = getContextBlocks();
      const res = await extendWithAI(prompt, contextBlocks);
      const newBlock = { ...res.data, id: uuidv4(), order: activePage.blocks.length };
      addBlock(newBlock);
      setEditMode(true);
      setEditingBlockId(newBlock.id);
      const updatedBlocks = [...activePage.blocks, newBlock].map((b, i) => ({ ...b, order: i }));
      await updatePage(activePage.id, { blocks: updatedBlocks });
      addToast('New block generated! Review and save.', 'success');
      setPrompt('');
    } catch (err: any) {
      addToast(err.response?.data?.error || 'AI extend failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extend-panel">
      <div className="extend-header">
        <span className="extend-title">Extend with AI</span>
        <button className="btn btn-ghost extend-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="extend-body">
        <p className="extend-desc">
          Describe what you want to add. Claude will generate a new block that fits your content.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Add a tip about time complexity analysis&#10;Add a table comparing sorting algorithms&#10;Create a checklist of key takeaways"
          className="extend-textarea"
          disabled={loading}
        />
        <div className="extend-context-info">
          Context: last {Math.min(3, activePage?.blocks.length || 0)} blocks will be sent as context
        </div>
        <button
          className="btn btn-primary extend-submit-btn"
          onClick={handleExtend}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Generating...' : 'Generate with Claude →'}
        </button>
      </div>
    </div>
  );
}
