import { useState } from 'react';
import { TableData } from '../../../../../shared/types';

interface Props { data: TableData; editMode: boolean; onUpdate: (d: TableData) => void; }

export function TableBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<TableData>(data);

  if (!editMode) {
    return (
      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        {data.caption && <p style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{data.caption}</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{(data.headers || []).map((h, i) => <th key={i} style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'rgba(244,197,66,0.08)', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(data.rows || []).map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: '0.5rem 0.75rem', color: 'var(--text)', borderBottom: '1px solid rgba(30,30,46,0.5)', fontSize: '0.875rem' }}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Headers (comma-separated)</label>
      <input value={d.headers?.join(', ')} onChange={(e) => setD({ ...d, headers: e.target.value.split(',').map(s => s.trim()) })} style={{ width: '100%' }} />
      <label style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Rows (one per line, cells comma-separated)</label>
      <textarea value={d.rows?.map(r => r.join(', ')).join('\n')} onChange={(e) => setD({ ...d, rows: e.target.value.split('\n').map(r => r.split(',').map(s => s.trim())) })} style={{ width: '100%', minHeight: '100px' }} />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
