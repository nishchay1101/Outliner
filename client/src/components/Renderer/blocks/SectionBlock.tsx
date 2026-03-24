import { useState } from 'react';
import { SectionData } from '../../../../../shared/types';

interface Props { data: SectionData; editMode: boolean; onUpdate: (data: SectionData) => void; }

export function SectionBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<SectionData>(data);

  if (!editMode) {
    const slug = data.title ? data.title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)+/g, '').toLowerCase() : '';
    return (
      <div className="segment" id={slug}>
        <div className="segment-header">
          <div className="segment-title">{data.title}</div>
          <div className="segment-line"></div>
        </div>
        <p style={{ lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-wrap', padding: '0 1rem' }}>{data.content}</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="Section title" style={{ width: '100%', fontFamily: 'var(--sans)', fontWeight: 700 }} />
      <textarea value={d.content} onChange={(e) => setD({ ...d, content: e.target.value })} style={{ width: '100%', minHeight: '140px' }} />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
