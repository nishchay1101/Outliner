import { useState } from 'react';
import { ExerciseData, ExerciseItem } from '../../../../../shared/types';

interface Props { data: ExerciseData; editMode: boolean; onUpdate: (d: ExerciseData) => void; }

export function ExerciseBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<ExerciseData>(data);

  if (!editMode) {
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent2)', marginBottom: '0.75rem' }}>{data.title}</h3>
        {(data.items || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.4rem 0' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '2px', background: 'rgba(224,92,92,0.15)', color: 'var(--accent2)', border: '1px solid rgba(224,92,92,0.3)', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {item.badge}
            </span>
            <span style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.text}</span>
          </div>
        ))}
      </div>
    );
  }

  const updateItem = (i: number, field: keyof ExerciseItem, val: string) => {
    const items = d.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it);
    setD({ ...d, items });
  };

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="Exercise title" style={{ width: '100%' }} />
      {d.items?.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
          <input value={item.badge} onChange={(e) => updateItem(i, 'badge', e.target.value)} placeholder="Badge" style={{ width: '80px' }} />
          <input value={item.text} onChange={(e) => updateItem(i, 'text', e.target.value)} placeholder="Text" style={{ flex: 1 }} />
          <button className="btn btn-danger" style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem' }} onClick={() => setD({ ...d, items: d.items.filter((_, idx) => idx !== i) })}>✕</button>
        </div>
      ))}
      <button className="btn btn-ghost" onClick={() => setD({ ...d, items: [...(d.items || []), { badge: 'Ex', text: '' }] })}>+ Add item</button>
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
