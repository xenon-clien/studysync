import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, ProgressBar, EmptyState } from '../components/ui';
import { LuPlus, LuPencil, LuTrash2, LuTarget } from 'react-icons/lu';
import { differenceInCalendarDays } from 'date-fns';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, subjects, seedSampleData } = useStudy();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const subjectName = (id) => subjects.find(s => s.id === id)?.name || 'General';

  const openAdd = () => { setEditing(null); setFormError(''); setForm({ name: '', targetDate: '', progress: 0, subjectId: subjects[0]?.id || '' }); setModalOpen(true); };
  const openEdit = (g) => { setEditing(g.id); setFormError(''); setForm(g); setModalOpen(true); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name?.trim()) {
      setFormError('Please enter a goal name');
      return;
    }
    setFormError('');
    const payload = {
      ...form,
      name: form.name.trim(),
      subjectId: form.subjectId || subjects[0]?.id || null,
      targetDate: form.targetDate || '',
      progress: Number(form.progress) || 0,
    };
    try {
      if (editing) await updateGoal(editing, payload);
      else await addGoal(payload);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save goal');
    }
  };

  const daysLeft = (dateStr) => differenceInCalendarDays(new Date(dateStr), new Date());

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Big Picture</div>
          <div className="page-title">Goals</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Goal</button>
      </div>

      {goals.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="🎯"
            title="No goals yet"
            description="Set a target like 'Score 90%+ in ETT Exams', or populate the full B.Tech goals."
            action={<button className="btn btn-secondary btn-sm" onClick={seedSampleData}>Populate Full B.Tech Study Database</button>}
          />
        </div>
      ) : (
        <div className="grid grid-2">
          {goals.map(g => {
            const left = daysLeft(g.targetDate);
            return (
              <div key={g.id} className="panel panel-pad">
                <div className="flex justify-between items-start mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--amber-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LuTarget size={18} color="var(--amber-deep)" />
                  </div>
                  <div className="flex gap-1">
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(g)}><LuPencil size={13} /></button>
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setDeleteConfirm(g)}><LuTrash2 size={13} color="var(--coral-deep)" /></button>
                  </div>
                </div>
                <div className="font-semibold" style={{ fontSize: 16, fontFamily: 'var(--font-display)' }}>{g.name}</div>
                <div className="text-xs muted mb-4">{subjectName(g.subjectId)} • {left >= 0 ? `${left} days left` : 'Past due'}</div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="muted">Progress</span>
                  <span className="font-semibold">{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} color={g.progress >= 100 ? 'var(--sage)' : 'var(--amber)'} />
                <input
                  type="range" min="0" max="100" value={g.progress}
                  onChange={e => updateGoal(g.id, { progress: Number(e.target.value) })}
                  style={{ width: '100%', marginTop: 14, accentColor: 'var(--amber)' }}
                />
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Goal' : 'Add Goal'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Goal'}</button>
        </>}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="text-xs mb-3" style={{ color: 'var(--coral-deep)', fontWeight: 600 }}>
              ⚠ {formError}
            </div>
          )}
          <div className="field">
            <label className="field-label">Goal Name <span style={{ color: 'var(--coral-deep)' }}>*</span></label>
            <input
              className="field-input"
              value={form.name || ''}
              onChange={e => { setForm({ ...form, name: e.target.value }); if (formError) setFormError(''); }}
              placeholder="e.g. Complete React in 30 Days"
              autoFocus
            />
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label className="field-label">Subject</label>
              <select className="field-input" value={form.subjectId || ''} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Target Date</label>
              <input type="date" className="field-input" value={form.targetDate || ''} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Progress (%)</label>
            <input type="number" min="0" max="100" className="field-input" value={form.progress ?? 0} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Goal"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteGoal(deleteConfirm.id); setDeleteConfirm(null); }}>Delete</button>
        </>}
      >
        <p className="text-sm">Delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
