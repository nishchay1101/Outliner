import { useState } from 'react';
import { TipData } from '../../../../../shared/types';
import './TipBlock.css';

interface Props { data: TipData; editMode: boolean; onUpdate: (d: TipData) => void; }

export function TipBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<TipData>(data);
  const borderColor = data.label?.toLowerCase().includes('warn') ? 'var(--accent2)' : data.label?.toLowerCase().includes('note') ? 'var(--accent)' : 'var(--accent3)';

  if (!editMode) {
    return (
      <div className="card tip-card" style={{ '--tip-border-color': borderColor } as React.CSSProperties}>
        <div className="tip-label">{data.label || 'Tip'}</div>
        <div className="tip-content">{data.content}</div>
      </div>
    );
  }

  return (
    <div className="card tip-edit-card">
      <input 
        value={d.label} 
        onChange={(e) => setD({ ...d, label: e.target.value })} 
        placeholder="Label (Tip / Note / Warning)" 
        className="tip-edit-input" 
      />
      <textarea 
        value={d.content} 
        onChange={(e) => setD({ ...d, content: e.target.value })} 
        className="tip-edit-input" 
      />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
