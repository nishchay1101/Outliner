import { useState } from 'react';
import { CodeData, CodeLine } from '../../../../../shared/types';
import './CodeBlock.css';

interface Props { data: CodeData; editMode: boolean; onUpdate: (d: CodeData) => void; }

export function CodeBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<CodeData>(data);

  if (!editMode) {
    return (
      <div className="code-block-container">
        {data.title && <div className="code-block-title">{data.title}</div>}
        {(data.lines || []).map((line, i) => (
          <div 
            key={i} 
            className="code-line" 
            style={{ paddingLeft: `${(line.indent || 0) * 1.5}rem` }}
          >
            <span className={`code-token-${line.type || 'normal'}`}>{line.text}</span>
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
    <div className="card code-edit-card">
      <input 
        value={d.title || ''} 
        onChange={(e) => setD({ ...d, title: e.target.value })} 
        placeholder="Code block title (optional)" 
        className="code-edit-input" 
      />
      <textarea
        value={rawText}
        onChange={(e) => handleRawChange(e.target.value)}
        className="code-edit-textarea"
      />
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
