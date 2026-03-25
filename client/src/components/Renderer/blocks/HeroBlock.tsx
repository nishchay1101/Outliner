import { useState } from 'react';
import { HeroData } from '../../../../../shared/types';
import './HeroBlock.css';

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
      <div className="header hero-header-no-border">
        <h1 className="hero-title-margin">
          {data.title}
        </h1>
        {data.subtitle && <p className="hero-subtitle">{data.subtitle}</p>}
        
        {data.badges?.length > 0 && (
          <div className="hero-badges-container">
            {data.badges.map((b, i) => (
              <div key={i} className="lecture-badge">
                <span className="dot"></span> {b}
              </div>
            ))}
          </div>
        )}
        
        {data.metaChips?.length > 0 && (
          <div className="header-meta hero-meta-margin">
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
    <div className="card hero-edit-card">
      <label className="hero-edit-label">Title</label>
      <input 
        value={d.title} 
        onChange={(e) => setD({ ...d, title: e.target.value })} 
        className="hero-edit-input" 
      />
      <label className="hero-edit-label">Subtitle</label>
      <input 
        value={d.subtitle} 
        onChange={(e) => setD({ ...d, subtitle: e.target.value })} 
        className="hero-edit-input" 
      />
      <label className="hero-edit-label">Badges (comma-separated)</label>
      <input 
        value={d.badges?.join(', ') || ''} 
        onChange={(e) => setD({ ...d, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
        className="hero-edit-input" 
      />
      <button className="btn btn-primary" onClick={handleSave}>Save</button>
    </div>
  );
}
