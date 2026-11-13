import { LuX } from 'react-icons/lu';

export function Modal({ open, onClose, title, children, footer, maxWidth }) {
  if (!open) return null;
  return (
    <div className="modal-veil" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box fade-in" style={maxWidth ? { maxWidth } : undefined}>
        <div className="modal-head">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><LuX size={16} /></button>
        </div>
        <div className="modal-body-pad">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = 'amber', sub }) {
  const washMap = { amber: 'var(--amber-wash)', sage: 'var(--sage-wash)', coral: 'var(--coral-wash)', slate: 'var(--slate-wash)' };
  const colorMap = { amber: 'var(--amber-deep)', sage: 'var(--sage-deep)', coral: 'var(--coral-deep)', slate: 'var(--slate)' };
  return (
    <div className="panel panel-pad">
      <div className="flex items-center gap-3">
        <div style={{ width: 42, height: 42, borderRadius: 11, background: washMap[accent], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={19} color={colorMap[accent]} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>{value}</div>
          <div className="text-xs muted truncate">{label}</div>
        </div>
      </div>
      {sub && <div className="text-xs mt-3" style={{ color: colorMap[accent] }}>{sub}</div>}
    </div>
  );
}

export function Pill({ children, tone = 'amber' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function ProgressBar({ value, max = 100, color = 'var(--amber)', height = 8 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="bar-track" style={{ height }}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function DotProgress({ filled, total = 7 }) {
  return (
    <div className="dot-row">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`dot ${i < filled ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

export function CheckBox({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`check-box ${checked ? 'checked' : ''}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {description && <div className="text-sm" style={{ marginBottom: 16 }}>{description}</div>}
      {action}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-box" style={{ maxWidth: 280 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input className="field-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-strip">
      {tabs.map(t => (
        <button key={t.value} className={`tab-btn ${active === t.value ? 'active' : ''}`} onClick={() => onChange(t.value)}>
          {t.label}{t.count !== undefined && ` (${t.count})`}
        </button>
      ))}
    </div>
  );
}

export function priorityTone(priority) {
  return priority === 'High' ? 'coral' : priority === 'Medium' ? 'amber' : 'slate';
}
