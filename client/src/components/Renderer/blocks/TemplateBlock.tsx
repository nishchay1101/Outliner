import { TemplateData } from '../../../../../shared/types';
import './TemplateBlock.css';

interface Props { data: TemplateData; editMode: boolean; onUpdate: (d: TemplateData) => void; }

export function TemplateBlock({ data }: Props) {
  const renderLineTokens = (text: string) => {
    const tokens: { text: string; type: string }[] = [];
    const keywords = /^(function|if|else|for|while|return|const|let|var|class|import|export|def|print|pass|break|continue|in|range|max|min|sum|del)\b/;
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

  return (
    <div className="template-card fade-up">
      <div className="template-header">
        <span className="template-label">{data.title}</span>
        <div className="template-header-line"></div>
      </div>

      <div className="template-content-grid">
        <div className="template-code-section">
          {data.lines.map((line, i) => (
            <div 
              key={i} 
              className="code-line" 
              style={{ paddingLeft: `${(line.indent || 0) * 1.5}rem` }}
            >
              {renderLineTokens(line.text)}
            </div>
          ))}
        </div>

        <div className="template-description-section">
          <div className="template-desc-title">{data.descriptionTitle}</div>
          <ul className="template-desc-list">
            {data.descriptionItems.map((item, i) => (
              <li key={i} className="template-desc-item">
                <span className="template-desc-num">{i + 1}</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {data.note && (
        <div className="template-note" dangerouslySetInnerHTML={{ __html: data.note }} />
      )}
    </div>
  );
}
