import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, ProgressBar, SearchInput, EmptyState } from '../components/ui';
import { SUBJECT_COLORS } from '../utils/seedData';
import { LuPlus, LuPencil, LuTrash2, LuBookOpen } from 'react-icons/lu';

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject, tasks, seedSampleData } = useStudy();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setFormError(''); setForm({ name: '', color: SUBJECT_COLORS[0].value, goalHours: 20, loggedHours: 0 }); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s.id); setFormError(''); setForm(s); setModalOpen(true); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name?.trim()) {
      setFormError('Please enter a subject name');
      return;
    }
    setFormError('');
    const payload = {
      ...form,
      name: form.name.trim(),
      color: form.color || SUBJECT_COLORS[0].value,
      goalHours: Number(form.goalHours) || 20,
      loggedHours: Number(form.loggedHours) || 0,
    };
    try {
      if (editing) await updateSubject(editing, payload);
      else await addSubject(payload);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save subject');
    }
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Study Subjects</div>
          <div className="page-title">Your Subjects</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Subject</button>
      </div>

      <div className="mb-6"><SearchInput value={search} onChange={setSearch} placeholder="Search subjects..." /></div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="📘"
            title="No subjects yet"
            description="Add your first subject to start tracking study hours, or populate full B.Tech CSE subjects."
            action={subjects.length === 0 ? (
              <button className="btn btn-secondary btn-sm" onClick={seedSampleData}>
                Populate Full B.Tech Study Database
              </button>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-3">
          {filtered.map(s => {
            const taskCount = tasks.filter(t => t.subjectId === s.id).length;
            return (
              <div key={s.id} className="panel panel-pad fade-in">
                <div className="flex justify-between items-start mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LuBookOpen size={18} color={s.color} />
                  </div>
                  <div className="flex gap-1">
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(s)}><LuPencil size={13} /></button>
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setDeleteConfirm(s)}><LuTrash2 size={13} color="var(--coral-deep)" /></button>
                  </div>
                </div>
                <div className="font-semibold" style={{ fontSize: 16, fontFamily: 'var(--font-display)' }}>{s.name}</div>
                <div className="text-xs muted mb-3">{taskCount} task{taskCount !== 1 ? 's' : ''}</div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="muted">Progress</span>
                  <span className="font-semibold">{s.loggedHours}/{s.goalHours}h</span>
                </div>
                <ProgressBar value={s.loggedHours} max={s.goalHours} color={s.color} />
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Subject' : 'Add Subject'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Subject'}</button>
        </>}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="text-xs mb-3" style={{ color: 'var(--coral-deep)', fontWeight: 600 }}>
              ⚠ {formError}
            </div>
          )}
          <div className="field">
            <label className="field-label">Subject Name <span style={{ color: 'var(--coral-deep)' }}>*</span></label>
            <input
              className="field-input"
              value={form.name || ''}
              onChange={e => { setForm({ ...form, name: e.target.value }); if (formError) setFormError(''); }}
              placeholder="e.g. JavaScript"
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field-label">Color</label>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {SUBJECT_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, color: c.value })}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', background: c.value,
                    border: form.color === c.value ? '3px solid var(--ink)' : '3px solid transparent',
                    cursor: 'pointer'
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Study Goal (Hours)</label>
            <input type="number" className="field-input" value={form.goalHours || 0} onChange={e => setForm({ ...form, goalHours: Number(e.target.value) })} />
          </div>
          {editing && (
            <div className="field">
              <label className="field-label">Hours Logged</label>
              <input type="number" className="field-input" value={form.loggedHours || 0} onChange={e => setForm({ ...form, loggedHours: Number(e.target.value) })} />
            </div>
          )}
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Subject"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteSubject(deleteConfirm.id); setDeleteConfirm(null); }}>Delete</button>
        </>}
      >
        <p className="text-sm">Delete <strong>{deleteConfirm?.name}</strong>? Its tasks will be removed too.</p>
      </Modal>
    </div>
  );
}
