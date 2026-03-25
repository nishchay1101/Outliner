import { useState } from 'react';
import { ChecklistData } from '../../../../../shared/types';
import './ChecklistBlock.css';

interface Props { data: ChecklistData; editMode: boolean; onUpdate: (d: ChecklistData) => void; }

export function ChecklistBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<ChecklistData>(data);

  if (!editMode) {
    return (
      <div className="card checklist-container-card">
        <h3 className="checklist-title">{data.title}</h3>
        <ul className="checklist-ul">
          {(data.items || []).map((item, i) => (
            <li key={i} className="checklist-li">
              <span className="checklist-check-mark">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="card checklist-edit-card">
      <input 
        value={d.title} 
        onChange={(e) => setD({ ...d, title: e.target.value })} 
        placeholder="Checklist title" 
        className="checklist-edit-input" 
      />
      <textarea 
        value={d.items?.join('\n')} 
        onChange={(e) => setD({ ...d, items: e.target.value.split('\n').filter(Boolean) })} 
        placeholder="One item per line" 
        className="checklist-edit-textarea" 
      />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
