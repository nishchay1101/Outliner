import { useState } from 'react';
import { HeroData } from '../../../../../shared/types';

interface Props {
  data: HeroData;
  editMode: boolean;
  onUpdate: (data: HeroData) => void;
}

export function HeroBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<HeroData>(data);

  const handleSave = () => onUpdate(d);

  if (!editMode) {
    return (
      <div className="header" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
        <h1 style={{ marginBottom: '0.75rem' }}>
          {data.title}
        </h1>
        {data.subtitle && <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>{data.subtitle}</p>}
        
        {data.badges?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {data.badges.map((b, i) => (
              <div key={i} className="lecture-badge">
                <span className="dot"></span> {b}
              </div>
            ))}
          </div>
        )}
        
        {data.metaChips?.length > 0 && (
          <div className="header-meta" style={{ marginTop: '0.5rem' }}>
            {data.metaChips.map((c, i) => (
              <div key={i} className="meta-chip">
                {c.label}: <strong>{c.value}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Title</label>
      <input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} style={{ width: '100%' }} />
      <label style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Subtitle</label>
      <input value={d.subtitle} onChange={(e) => setD({ ...d, subtitle: e.target.value })} style={{ width: '100%' }} />
      <label style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Badges (comma-separated)</label>
      <input value={d.badges?.join(', ') || ''} onChange={(e) => setD({ ...d, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} style={{ width: '100%' }} />
      <button className="btn btn-primary" onClick={handleSave}>Save</button>
    </div>
  );
}
