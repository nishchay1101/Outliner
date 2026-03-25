import { DividerData } from '../../../../../shared/types';
import './DividerBlock.css';

interface Props { data: DividerData; editMode: boolean; onUpdate: (d: DividerData) => void; }

export function DividerBlock({ data, editMode, onUpdate }: Props) {
  const isGradient = data.style === 'gradient';
  const background = isGradient ? 'linear-gradient(90deg, transparent, var(--accent), transparent)' : 'var(--border)';

  if (!editMode) {
    return (
      <div className="divider-padding">
        <hr className="divider-hr" style={{ background }} />
      </div>
    );
  }

  return (
    <div className="card divider-edit-card">
      <label className="divider-edit-label">Style:</label>
      <select 
        value={data.style || 'solid'} 
        onChange={(e) => onUpdate({ ...data, style: e.target.value as DividerData['style'] })} 
        className="divider-edit-select"
      >
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="gradient">Gradient</option>
      </select>
    </div>
  );
}
