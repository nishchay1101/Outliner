import { useState } from 'react';
import { usePageStore } from '../../store/pageStore';
import { extendWithAI, updatePage } from '../../api/client';
import { v4 as uuidv4 } from 'uuid';

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
    <div style={{ width: '300px', minWidth: '300px', borderLeft: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--accent3)', textTransform: 'uppercase' }}>Extend with AI</span>
        <button className="btn btn-ghost" style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }} onClick={onClose}>✕</button>
      </div>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          Describe what you want to add. Claude will generate a new block that fits your content.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Add a tip about time complexity analysis&#10;Add a table comparing sorting algorithms&#10;Create a checklist of key takeaways"
          style={{ width: '100%', minHeight: '140px', resize: 'vertical' }}
          disabled={loading}
        />
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-dim)', padding: '0.5rem', background: 'rgba(92,244,180,0.05)', border: '1px solid rgba(92,244,180,0.1)', borderRadius: '2px' }}>
          Context: last {Math.min(3, activePage?.blocks.length || 0)} blocks will be sent as context
        </div>
        <button
          className="btn btn-primary"
          onClick={handleExtend}
          disabled={loading || !prompt.trim()}
          style={{ width: '100%', opacity: loading || !prompt.trim() ? 0.6 : 1 }}
        >
          {loading ? 'Generating...' : 'Generate with Claude →'}
        </button>
      </div>
    </div>
  );
}
