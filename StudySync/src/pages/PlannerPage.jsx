import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, EmptyState } from '../components/ui';
import { LuPlus, LuPencil, LuTrash2, LuClock } from 'react-icons/lu';

const today = new Date().toISOString().slice(0, 10);

export default function PlannerPage() {
  const { schedule, addScheduleItem, updateScheduleItem, deleteScheduleItem, subjects, seedSampleData } = useStudy();
  const [date, setDate] = useState(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const dayItems = schedule.filter(s => s.date === date).sort((a, b) => a.time.localeCompare(b.time));

  const openAdd = () => {
    setEditing(null);
    setFormError('');
    setForm({
      date,
      time: '09:00',
      title: '',
      subject: subjects[0]?.name || 'General',
      duration: 60,
    });
    setModalOpen(true);
  };
  const openEdit = (s) => { setEditing(s.id); setFormError(''); setForm(s); setModalOpen(true); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.title?.trim()) {
      setFormError('Please enter a study block title');
      return;
    }
    setFormError('');
    const payload = {
      ...form,
      title: form.title.trim(),
      date: form.date || date,
      time: form.time || '09:00',
      subject: form.subject || subjects[0]?.name || 'General',
      duration: Number(form.duration) || 60,
    };
    try {
      if (editing) await updateScheduleItem(editing, payload);
      else await addScheduleItem(payload);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save study block');
    }
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Daily Planner</div>
          <div className="page-title">Plan Your Day</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Block</button>
      </div>

      <div className="panel panel-pad mb-6 flex items-center gap-3">
        <LuClock size={16} className="muted" />
        <input type="date" className="field-input" style={{ width: 200 }} value={date} onChange={e => setDate(e.target.value)} />
        {date === today && <span className="pill pill-amber">Today</span>}
      </div>

      {dayItems.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="🗓️"
            title="Nothing scheduled"
            description="Add a study block to plan this day, or populate the full B.Tech schedule."
            action={schedule.length === 0 ? (
              <button className="btn btn-secondary btn-sm" onClick={seedSampleData}>
                Populate Full B.Tech Study Database
              </button>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="panel">
          {dayItems.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', gap: 16, padding: '16px 22px', borderBottom: i < dayItems.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div className="mono font-semibold" style={{ width: 64, color: 'var(--amber-deep)', fontSize: 14, paddingTop: 2 }}>{s.time}</div>
              <div style={{ width: 4, borderRadius: 3, background: 'var(--amber)' }} />
              <div style={{ flex: 1 }}>
                <div className="font-semibold text-sm">{s.title}</div>
                <div className="text-xs muted">{s.subject} • {s.duration} min</div>
              </div>
              <div className="flex gap-1" style={{ alignSelf: 'flex-start' }}>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(s)}><LuPencil size={13} /></button>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setDeleteConfirm(s)}><LuTrash2 size={13} color="var(--coral-deep)" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Block' : 'Add Study Block'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Block'}</button>
        </>}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="text-xs mb-3" style={{ color: 'var(--coral-deep)', fontWeight: 600 }}>
              ⚠ {formError}
            </div>
          )}
          <div className="field">
            <label className="field-label">Title <span style={{ color: 'var(--coral-deep)' }}>*</span></label>
            <input
              className="field-input"
              value={form.title || ''}
              onChange={e => { setForm({ ...form, title: e.target.value }); if (formError) setFormError(''); }}
              placeholder="e.g. React Revision"
              autoFocus
            />
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label className="field-label">Date</label>
              <input type="date" className="field-input" value={form.date || date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field">
              <label className="field-label">Time</label>
              <input type="time" className="field-input" value={form.time || '09:00'} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label className="field-label">Subject</label>
              <select className="field-input" value={form.subject || ''} onChange={e => setForm({ ...form, subject: e.target.value })}>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Duration (min)</label>
              <input type="number" className="field-input" value={form.duration || 60} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Remove Block"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteScheduleItem(deleteConfirm.id); setDeleteConfirm(null); }}>Remove</button>
        </>}
      >
        <p className="text-sm">Remove <strong>{deleteConfirm?.title}</strong> from your plan?</p>
      </Modal>
    </div>
  );
}
