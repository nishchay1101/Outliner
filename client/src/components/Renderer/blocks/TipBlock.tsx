import { useState } from 'react';
import { TipData } from '../../../../../shared/types';

interface Props { data: TipData; editMode: boolean; onUpdate: (d: TipData) => void; }

export function TipBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<TipData>(data);
  const borderColor = data.label?.toLowerCase().includes('warn') ? 'var(--accent2)' : data.label?.toLowerCase().includes('note') ? 'var(--accent)' : 'var(--accent3)';

  if (!editMode) {
    return (
      <div className="card" style={{ padding: '1.25rem', borderLeft: `3px solid ${borderColor}` }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: borderColor, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{data.label || 'Tip'}</div>
        <div style={{ lineHeight: 1.7, color: 'var(--text)' }}>{data.content}</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <input value={d.label} onChange={(e) => setD({ ...d, label: e.target.value })} placeholder="Label (Tip / Note / Warning)" style={{ width: '100%' }} />
      <textarea value={d.content} onChange={(e) => setD({ ...d, content: e.target.value })} style={{ width: '100%' }} />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
