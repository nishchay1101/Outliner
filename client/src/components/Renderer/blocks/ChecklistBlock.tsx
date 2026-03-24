import { useState } from 'react';
import { ChecklistData } from '../../../../../shared/types';

interface Props { data: ChecklistData; editMode: boolean; onUpdate: (d: ChecklistData) => void; }

export function ChecklistBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<ChecklistData>(data);

  if (!editMode) {
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>{data.title}</h3>
        <ul style={{ listStyle: 'none' }}>
          {(data.items || []).map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.3rem 0', color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent3)', fontFamily: 'var(--mono)', flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="Checklist title" style={{ width: '100%' }} />
      <textarea value={d.items?.join('\n')} onChange={(e) => setD({ ...d, items: e.target.value.split('\n').filter(Boolean) })} placeholder="One item per line" style={{ width: '100%', minHeight: '100px' }} />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
