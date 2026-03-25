import { useState } from 'react';
import { ProblemData, ProblemStep } from '../../../../../shared/types';
import './ProblemBlock.css';

interface Props { data: ProblemData; editMode: boolean; onUpdate: (d: ProblemData) => void; }

export function ProblemBlock({ data, editMode, onUpdate }: Props) {
  const [d, setD] = useState<ProblemData>(data);

  if (!editMode) {
    const slug = data.title ? data.title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)+/g, '').toLowerCase() : '';
    return (
      <div className="problem-card" id={slug}>
        <div className="pc-header">
          <div className="pc-num">#{data.number}</div>
          <div className="pc-title">
            {data.link ? (
              <a href={data.link} target="_blank" rel="noopener noreferrer" className="pc-title-link">
                {data.title}
              </a>
            ) : (
              data.title
            )}
          </div>
          {data.timeMin && <div className="pc-time">⏱ {data.timeMin} min</div>}
          {data.link && <a href={data.link} className="pc-link" target="_blank" rel="noopener noreferrer">{data.platform || 'Link'} ↗</a>}
        </div>
        
        <div className="pc-body">
          <div className="pc-section">
            <div className="pc-section-label">Steps:</div>
            {(data.steps || []).map((step, i) => (
              <div key={i} className="step-row">
                <div className="step-num">{step.num}</div>
                <div className="step-text">{step.text}</div>
              </div>
            ))}
          </div>

          <div className="pc-section">
            {data.insights?.length > 0 && (
              <>
                <div className="pc-section-label">Insights</div>
                {data.insights.map((ins, i) => <div key={i} className="insight-box">▸ {ins}</div>)}
              </>
            )}
            {data.warnings?.length > 0 && (
              <>
                <div className="pc-section-label pc-section-label-margin">Warnings</div>
                {data.warnings.map((w, i) => <div key={i} className="warn-box">⚠ {w}</div>)}
              </>
            )}
            {data.complexity && Object.keys(data.complexity).length > 0 && (
              <>
                <div className="pc-section-label pc-section-label-margin">Complexity</div>
                <div className="complexity-row">
                  {data.complexity.time && <div className="cx-chip time">Time: {data.complexity.time}</div>}
                  {data.complexity.space && <div className="cx-chip space">Space: {data.complexity.space}</div>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const updateStep = (i: number, field: keyof ProblemStep, val: string | number) => {
    const steps = (d.steps || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setD({ ...d, steps });
  };

  return (
    <div className="card problem-edit-card">
      <div className="problem-edit-row">
        <input 
          value={String(d.number || '')} 
          onChange={(e) => setD({ ...d, number: parseInt(e.target.value) || 0 })} 
          placeholder="#" 
          className="problem-edit-num-input" 
        />
        <input 
          value={d.title || ''} 
          onChange={(e) => setD({ ...d, title: e.target.value })} 
          placeholder="Problem title" 
          className="problem-edit-flex1" 
        />
        <input 
          value={String(d.timeMin || '')} 
          onChange={(e) => setD({ ...d, timeMin: parseInt(e.target.value) || 0 })} 
          placeholder="Min" 
          className="problem-edit-num-input" 
        />
      </div>
      <div className="problem-edit-row">
        <input 
          value={d.platform || ''} 
          onChange={(e) => setD({ ...d, platform: e.target.value })} 
          placeholder="Platform" 
          className="problem-edit-flex1" 
        />
        <input 
          value={d.link || ''} 
          onChange={(e) => setD({ ...d, link: e.target.value })} 
          placeholder="Link URL" 
          className="problem-edit-flex2" 
        />
      </div>
      <label className="problem-edit-label">Steps:</label>
      {(d.steps || []).map((step, i) => (
        <div key={i} className="problem-edit-step-row">
          <span className="problem-edit-step-num">{step.num}.</span>
          <input 
            value={step.text} 
            onChange={(e) => updateStep(i, 'text', e.target.value)} 
            className="problem-edit-flex1" 
          />
          <button 
            className="btn btn-danger problem-edit-delete-btn" 
            onClick={() => setD({ ...d, steps: d.steps.filter((_, idx) => idx !== i) })}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-ghost" onClick={() => setD({ ...d, steps: [...(d.steps || []), { num: (d.steps?.length || 0) + 1, text: '' }] })}>+ Step</button>
      <label className="problem-edit-label">Insights (one per line):</label>
      <textarea 
        value={d.insights?.join('\n') || ''} 
        onChange={(e) => setD({ ...d, insights: e.target.value.split('\n').filter(Boolean) })} 
        className="problem-edit-textarea" 
      />
      <label className="problem-edit-label">Warnings (one per line):</label>
      <textarea 
        value={d.warnings?.join('\n') || ''} 
        onChange={(e) => setD({ ...d, warnings: e.target.value.split('\n').filter(Boolean) })} 
        className="problem-edit-textarea" 
      />
      <div className="problem-edit-row">
        <input 
          value={d.complexity?.time || ''} 
          onChange={(e) => setD({ ...d, complexity: { ...d.complexity, time: e.target.value, space: d.complexity?.space || '' } })} 
          placeholder="Time complexity" 
          className="problem-edit-flex1" 
        />
        <input 
          value={d.complexity?.space || ''} 
          onChange={(e) => setD({ ...d, complexity: { ...d.complexity, space: e.target.value, time: d.complexity?.time || '' } })} 
          placeholder="Space complexity" 
          className="problem-edit-flex1" 
        />
      </div>
      <button className="btn btn-primary" onClick={() => onUpdate(d)}>Save</button>
    </div>
  );
}
