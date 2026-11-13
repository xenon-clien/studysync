import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, Pill, priorityTone, Tabs, EmptyState, CheckBox } from '../components/ui';
import { LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu';

export default function AssignmentsPage() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, subjects, seedSampleData } = useStudy();
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const subjectName = (id) => subjects.find(s => s.id === id)?.name || '—';

  const filtered = assignments.filter(a => tab === 'all' ? true : tab === 'pending' ? a.status !== 'Completed' : a.status === 'Completed');

  const openAdd = () => {
    setEditing(null);
    setFormError('');
    setForm({
      title: '',
      subjectId: subjects[0]?.id || '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending',
    });
    setModalOpen(true);
  };
  const openEdit = (a) => { setEditing(a.id); setFormError(''); setForm(a); setModalOpen(true); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.title?.trim()) {
      setFormError('Please enter an assignment title');
      return;
    }
    setFormError('');
    const payload = {
      ...form,
      title: form.title.trim(),
      subjectId: form.subjectId || subjects[0]?.id || null,
      dueDate: form.dueDate || '',
      priority: form.priority || 'Medium',
      status: form.status || 'Pending',
    };
    try {
      if (editing) await updateAssignment(editing, payload);
      else await addAssignment(payload);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save assignment');
    }
  };

  const toggleStatus = (a) => updateAssignment(a.id, { status: a.status === 'Completed' ? 'Pending' : 'Completed' });

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Submissions</div>
          <div className="page-title">Assignments</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Assignment</button>
      </div>

      <Tabs
        tabs={[
          { label: 'All', value: 'all', count: assignments.length },
          { label: 'Pending', value: 'pending', count: assignments.filter(a => a.status !== 'Completed').length },
          { label: 'Completed', value: 'completed', count: assignments.filter(a => a.status === 'Completed').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="📋"
            title="No assignments"
            description="All assignments submitted, or populate the B.Tech CSE dataset."
            action={assignments.length === 0 ? (
              <button className="btn btn-secondary btn-sm" onClick={seedSampleData}>
                Populate Full B.Tech Study Database
              </button>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="panel">
          <div className="row-list">
            {filtered.map(a => (
              <div key={a.id} className="row-item">
                <CheckBox checked={a.status === 'Completed'} onChange={() => toggleStatus(a)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm font-semibold truncate" style={{ textDecoration: a.status === 'Completed' ? 'line-through' : 'none', opacity: a.status === 'Completed' ? .5 : 1 }}>{a.title}</div>
                  <div className="text-xs muted">{subjectName(a.subjectId)} • Due {a.dueDate}</div>
                </div>
                <Pill tone={priorityTone(a.priority)}>{a.priority}</Pill>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(a)}><LuPencil size={13} /></button>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setDeleteConfirm(a)}><LuTrash2 size={13} color="var(--coral-deep)" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Assignment' : 'Add Assignment'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Assignment'}</button>
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
              placeholder="e.g. ML Lab 3: Gradient Descent Implementation"
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
              <label className="field-label">Due Date</label>
              <input type="date" className="field-input" value={form.dueDate || ''} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Priority</label>
            <select className="field-input" value={form.priority || 'Medium'} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Assignment"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteAssignment(deleteConfirm.id); setDeleteConfirm(null); }}>Delete</button>
        </>}
      >
        <p className="text-sm">Delete <strong>{deleteConfirm?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
