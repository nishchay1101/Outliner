import { useState } from 'react';
import { CodeData, CodeLine } from '../../../../../shared/types';
import './CodeBlock.css';

interface Props { data: CodeData; editMode: boolean; onUpdate: (d: CodeData) => void; }

export function CodeBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<CodeData>(data);

  const renderLineTokens = (text: string) => {
    // Basic regex-based tokenization for rendering
    const tokens: { text: string; type: string }[] = [];
    const keywords = /^(function|if|else|for|while|return|const|let|var|class|import|export|def|print|pass|break|continue|in|range|max|min|sum|del)\b/;
    
    // Simple split-based parser for POC, could be improved with better regex
    const words = text.split(/(\s+|\(|\)|\,|\=|\.|\:)/);
    
    words.forEach(word => {
      if (!word) return;
      if (keywords.test(word)) tokens.push({ text: word, type: 'keyword' });
      else if (word.startsWith('//') || word.startsWith('#')) tokens.push({ text: word, type: 'comment' });
      else if (word.match(/^[a-zA-Z0-9_]+$/) && words[words.indexOf(word) + 1] === '(') tokens.push({ text: word, type: 'fn' });
      else if (word.match(/^[a-zA-Z0-9_]+$/) && (words[words.indexOf(word) + 1]?.trim() === '=' || words.indexOf(word) > 0 && words[words.indexOf(word)-1]?.trim() === '=')) tokens.push({ text: word, type: 'var' });
      else tokens.push({ text: word, type: 'normal' });
    });

    return tokens.map((t, i) => <span key={i} className={`code-token-${t.type}`}>{t.text}</span>);
  };

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
            {renderLineTokens(line.text)}
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
      if (/^(function|if|else|for|while|return|const|let|var|class|import|export|def|print|pass|break|continue|in|range|max|min|sum|del)\b/.test(trimmed)) type = 'keyword';
      else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('--')) type = 'comment';
      else if (trimmed.includes('(') && trimmed.substring(0, trimmed.indexOf('(')).match(/^[a-zA-Z0-9_]+$/)) type = 'fn';
      else if (trimmed.match(/^[a-zA-Z0-9_]+\s*=/)) type = 'var';
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
