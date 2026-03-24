import { DividerData } from '../../../../../shared/types';

interface Props { data: DividerData; editMode: boolean; onUpdate: (d: DividerData) => void; }

export function DividerBlock({ data, editMode, onUpdate }: Props) {
  const isGradient = data.style === 'gradient';

  if (!editMode) {
    return (
      <div style={{ padding: '0.5rem 0' }}>
        <hr style={{ border: 'none', height: '1px', background: isGradient ? 'linear-gradient(90deg, transparent, var(--accent), transparent)' : 'var(--border)' }} />
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <label style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Style:</label>
      <select value={data.style || 'solid'} onChange={(e) => onUpdate({ ...data, style: e.target.value as DividerData['style'] })} style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', padding: '0.3rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="gradient">Gradient</option>
      </select>
    </div>
  );
}
