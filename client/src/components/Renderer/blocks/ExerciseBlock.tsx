import { useState } from 'react';
import { ExerciseData, ExerciseItem } from '../../../../../shared/types';
import './ExerciseBlock.css';

interface Props { data: ExerciseData; editMode: boolean; onUpdate: (d: ExerciseData) => void; }

export function ExerciseBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<ExerciseData>(data);

  if (!editMode) {
    return (
      <div className="card exercise-container-card">
        <h3 className="exercise-title">{data.title}</h3>
        {(data.items || []).map((item, i) => (
          <div key={i} className="exercise-item-row">
            <span className="exercise-item-badge">
              {item.badge}
            </span>
            <span className="exercise-item-text">{item.text}</span>
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
    <div className="card exercise-edit-card">
      <input 
        value={d.title} 
        onChange={(e) => setD({ ...d, title: e.target.value })} 
        placeholder="Exercise title" 
        className="exercise-edit-title" 
      />
      {d.items?.map((item, i) => (
        <div key={i} className="exercise-edit-item-row">
          <input 
            value={item.badge} 
            onChange={(e) => updateItem(i, 'badge', e.target.value)} 
            placeholder="Badge" 
            className="exercise-edit-badge-input" 
          />
          <input 
            value={item.text} 
            onChange={(e) => updateItem(i, 'text', e.target.value)} 
            placeholder="Text" 
            className="exercise-edit-text-input" 
          />
          <button 
            className="btn btn-danger exercise-edit-delete-btn" 
            onClick={() => setD({ ...d, items: d.items.filter((_, idx) => idx !== i) })}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-ghost" onClick={() => setD({ ...d, items: [...(d.items || []), { badge: 'Ex', text: '' }] })}>+ Add item</button>
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
