import { useState } from 'react';
import { TimelineData, TimelineSegment } from '../../../../../shared/types';
import './TimelineBlock.css';

interface Props { data: TimelineData; editMode: boolean; onUpdate: (d: TimelineData) => void; }

export function TimelineBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<TimelineData>(data);

  if (!editMode) {
    const getSlug = (label: string) => {
      if (!label) return '';
      return label.trim().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)+/g, '').toLowerCase();
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, time: string) => {
      e.preventDefault();
      const slug = getSlug(label);
      let el = document.getElementById(slug);
      
      // Fallback: Fuzzy finding by looking at section titles for the time or label
      if (!el) {
        const titleNodes = Array.from(document.querySelectorAll('.segment-title, .pc-title, h1, h2, h3'));
        for (const node of titleNodes) {
          const text = node.textContent?.toLowerCase() || '';
          if ((time && text.includes(time.toLowerCase())) || (label && text.includes(label.toLowerCase().substring(0, 10)))) {
            el = (node.closest('.segment') || node.closest('.problem-card') || node) as HTMLElement;
            break;
          }
        }
      }

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `#${slug}`);
      }
    };

    return (
      <div className="timeline-bar">
        {(data.segments || []).map((seg, i) => {
          const slug = getSlug(seg.label);
          return (
            <a 
              key={i} 
              href={`#${slug}`}
              onClick={(e) => handleClick(e, seg.label, seg.time)}
              className={`tl-seg ${seg.active ? 'active' : ''} timeline-anchor-reset`} 
            >
              <span className="tl-time">{seg.time}</span>
              <span className="tl-name">{seg.label}</span>
            </a>
          );
        })}
      </div>
    );
  }

  const updateSeg = (i: number, field: keyof TimelineSegment, val: string | boolean) => {
    const segments = d.segments.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setD({ ...d, segments });
  };

  return (
    <div className="card timeline-edit-card">
      {d.segments?.map((seg, i) => (
        <div key={i} className="timeline-edit-row">
          <input 
            value={seg.time} 
            onChange={(e) => updateSeg(i, 'time', e.target.value)} 
            placeholder="0–5 min" 
            className="timeline-edit-time-input" 
          />
          <input 
            value={seg.label} 
            onChange={(e) => updateSeg(i, 'label', e.target.value)} 
            placeholder="Label" 
            className="timeline-edit-label-input" 
          />
          <label className="timeline-edit-checkbox-label">
            <input type="checkbox" checked={seg.active} onChange={(e) => updateSeg(i, 'active', e.target.checked)} /> Active
          </label>
          <button 
            className="btn btn-danger timeline-edit-delete-btn" 
            onClick={() => setD({ ...d, segments: d.segments.filter((_, idx) => idx !== i) })}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-ghost" onClick={() => setD({ ...d, segments: [...(d.segments || []), { time: '', label: '', active: false }] })}>+ Add segment</button>
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
