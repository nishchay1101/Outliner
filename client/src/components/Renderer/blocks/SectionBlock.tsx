import { useState } from 'react';
import { SectionData } from '../../../../../shared/types';
import './SectionBlock.css';

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
        <p className="section-content">{data.content}</p>
      </div>
    );
  }

  return (
    <div className="card section-edit-card">
      <input 
        value={d.title} 
        onChange={(e) => setD({ ...d, title: e.target.value })} 
        placeholder="Section title" 
        className="section-edit-title" 
      />
      <textarea 
        value={d.content} 
        onChange={(e) => setD({ ...d, content: e.target.value })} 
        className="section-edit-textarea" 
      />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
