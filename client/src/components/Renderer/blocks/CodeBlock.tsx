import { useState } from 'react';
import { CodeData, CodeLine } from '../../../../../shared/types';

interface Props { data: CodeData; editMode: boolean; onUpdate: (d: CodeData) => void; }

function getColor(type: CodeLine['type']): string {
  switch (type) {
    case 'keyword': return '#c792ea';
    case 'comment': return 'var(--muted)';
    case 'var': return 'var(--accent3)';
    default: return 'var(--text)';
  }
}

export function CodeBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<CodeData>(data);

  if (!editMode) {
    return (
      <div style={{ background: '#0d0d16', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.25rem', overflowX: 'auto' }}>
        {data.title && <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{data.title}</div>}
        {(data.lines || []).map((line, i) => (
          <div key={i} style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', lineHeight: '1.7', paddingLeft: `${(line.indent || 0) * 1.5}rem`, whiteSpace: 'pre' }}>
            <span style={{ color: getColor(line.type) }}>{line.text}</span>
          </div>
        ))}
      </div>
    );
  }

  const rawText = d.lines?.map(l => '  '.repeat(l.indent || 0) + l.text).join('\n') || '';

  const handleRawChange = (text: string) => {
    const lines: CodeLine[] = text.split('\n').map(l => {
      const trimmed = l.trimStart();
      const indent = Math.floor((l.length - trimmed.length) / 2);
      let type: CodeLine['type'] = 'normal';
      if (/^(function|if|else|for|while|return|const|let|var|class|import|export|def|print|pass|break|continue)\b/.test(trimmed)) type = 'keyword';
      else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('--')) type = 'comment';
      return { text: trimmed, indent, type };
    });
    setD({ ...d, lines });
  };

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <input value={d.title || ''} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="Code block title (optional)" style={{ width: '100%' }} />
      <textarea
        value={rawText}
        onChange={(e) => handleRawChange(e.target.value)}
        style={{ width: '100%', minHeight: '160px', fontFamily: 'var(--mono)', fontSize: '0.82rem' }}
      />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
