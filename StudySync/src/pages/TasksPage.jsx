import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, Pill, priorityTone, SearchInput, EmptyState, CheckBox, Tabs } from '../components/ui';
import { LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu';

export default function TasksPage() {
  const { tasks, subjects, addTask, updateTask, deleteTask, toggleTaskComplete, seedSampleData } = useStudy();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const subjectName = (id) => subjects.find(s => s.id === id)?.name || '—';
  const subjectColor = (id) => subjects.find(s => s.id === id)?.color || 'var(--amber)';

  const filtered = tasks.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === 'All' || t.subjectId === subjectFilter;
    const matchFilter =
      filter === 'all' ? true :
      filter === 'completed' ? t.status === 'Completed' :
      filter === 'pending' ? t.status !== 'Completed' :
      filter === 'high' ? t.priority === 'High' : true;
    return matchSearch && matchSubject && matchFilter;
  });

  const openAdd = () => {
    setEditing(null);
    setFormError('');
    setForm({
      name: '',
      subjectId: subjects[0]?.id || '',
      priority: 'Medium',
      deadline: '',
      estHours: 1,
      status: 'Pending',
    });
    setModalOpen(true);
  };
  const openEdit = (t) => { setEditing(t.id); setFormError(''); setForm(t); setModalOpen(true); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name?.trim()) {
      setFormError('Please enter a task name');
      return;
    }
    setFormError('');
    const payload = {
      ...form,
      name: form.name.trim(),
      subjectId: form.subjectId || subjects[0]?.id || null,
      priority: form.priority || 'Medium',
      deadline: form.deadline || '',
      estHours: Number(form.estHours) || 1,
      status: form.status || 'Pending',
    };
    try {
      if (editing) await updateTask(editing, payload);
      else await addTask(payload);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save task');
    }
  };

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status !== 'Completed').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    high: tasks.filter(t => t.priority === 'High').length,
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Study Tasks</div>
          <div className="page-title">Tasks</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Task</button>
      </div>

      <Tabs
        tabs={[
          { label: 'All', value: 'all', count: counts.all },
          { label: 'Pending', value: 'pending', count: counts.pending },
          { label: 'Completed', value: 'completed', count: counts.completed },
          { label: 'High Priority', value: 'high', count: counts.high },
        ]}
        active={filter}
        onChange={setFilter}
      />

      <div className="flex gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." />
        <select className="field-input" style={{ width: 200 }} value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
          <option value="All">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="📝"
            title="No tasks found"
            description="Try adjusting your filters, add a new task, or populate full B.Tech CSE tasks."
            action={tasks.length === 0 ? (
              <button className="btn btn-secondary btn-sm" onClick={seedSampleData}>
                Populate Full B.Tech Study Database
              </button>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="panel">
          <div className="row-list">
            {filtered.map(t => (
              <div key={t.id} className="row-item">
                <CheckBox checked={t.status === 'Completed'} onChange={() => toggleTaskComplete(t.id)} />
                <div style={{ width: 3, height: 32, borderRadius: 2, background: subjectColor(t.subjectId), flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm font-semibold truncate" style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none', opacity: t.status === 'Completed' ? .5 : 1 }}>{t.name}</div>
                  <div className="text-xs muted">{subjectName(t.subjectId)} • Due {t.deadline} • {t.estHours}h estimated</div>
                </div>
                <Pill tone={priorityTone(t.priority)}>{t.priority}</Pill>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(t)}><LuPencil size={13} /></button>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setDeleteConfirm(t)}><LuTrash2 size={13} color="var(--coral-deep)" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Task' : 'Add Task'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Task'}</button>
        </>}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="text-xs mb-3" style={{ color: 'var(--coral-deep)', fontWeight: 600 }}>
              ⚠ {formError}
            </div>
          )}
          <div className="field">
            <label className="field-label">Task Name <span style={{ color: 'var(--coral-deep)' }}>*</span></label>
            <input
              className="field-input"
              value={form.name || ''}
              onChange={e => { setForm({ ...form, name: e.target.value }); if (formError) setFormError(''); }}
              placeholder="e.g. Practice array methods"
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
              <label className="field-label">Priority</label>
              <select className="field-input" value={form.priority || 'Medium'} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label className="field-label">Deadline</label>
              <input type="date" className="field-input" value={form.deadline || ''} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="field">
              <label className="field-label">Estimated Hours</label>
              <input type="number" step="0.5" className="field-input" value={form.estHours || 1} onChange={e => setForm({ ...form, estHours: Number(e.target.value) })} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Status</label>
            <select className="field-input" value={form.status || 'Pending'} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Pending</option><option>Completed</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Task"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteTask(deleteConfirm.id); setDeleteConfirm(null); }}>Delete</button>
        </>}
      >
        <p className="text-sm">Delete <strong>{deleteConfirm?.name}</strong>? This can't be undone.</p>
      </Modal>
    </div>
  );
}
