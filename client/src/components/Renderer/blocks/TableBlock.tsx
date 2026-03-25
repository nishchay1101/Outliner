import { useState } from 'react';
import { TableData } from '../../../../../shared/types';
import './TableBlock.css';

interface Props { data: TableData; editMode: boolean; onUpdate: (d: TableData) => void; }

export function TableBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<TableData>(data);

  if (!editMode) {
    return (
      <div className="card table-container-card">
        {data.caption && <p className="table-caption-mono">{data.caption}</p>}
        <table className="table-full-width">
          <thead>
            <tr>{(data.headers || []).map((h, i) => <th key={i} className="table-th-styled">{h}</th>)}</tr>
          </thead>
          <tbody>
            {(data.rows || []).map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="table-td-styled">{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card table-edit-card">
      <label className="table-edit-label">Headers (comma-separated)</label>
      <input 
        value={d.headers?.join(', ')} 
        onChange={(e) => setD({ ...d, headers: e.target.value.split(',').map(s => s.trim()) })} 
        className="table-edit-input" 
      />
      <label className="table-edit-label">Rows (one per line, cells comma-separated)</label>
      <textarea 
        value={d.rows?.map(r => r.join(', ')).join('\n')} 
        onChange={(e) => setD({ ...d, rows: e.target.value.split('\n').map(r => r.split(',').map(s => s.trim())) })} 
        className="table-edit-textarea" 
      />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
