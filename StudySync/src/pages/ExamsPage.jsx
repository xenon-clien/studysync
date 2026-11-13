import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, Pill, Tabs, EmptyState } from '../components/ui';
import { LuPlus, LuPencil, LuTrash2, LuGraduationCap } from 'react-icons/lu';
import { differenceInCalendarDays } from 'date-fns';

const prepTone = { 'Not Started': 'coral', 'In Progress': 'amber', 'Completed': 'sage' };

export default function ExamsPage() {
  const { exams, addExam, updateExam, deleteExam, subjects } = useStudy();
  const [tab, setTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const subjectName = (id) => subjects.find(s => s.id === id)?.name || '—';
  const daysLeft = (d) => differenceInCalendarDays(new Date(d), new Date());

  const upcoming = exams.filter(e => daysLeft(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  const completed = exams.filter(e => daysLeft(e.date) < 0);
  const list = tab === 'upcoming' ? upcoming : completed;

  const openAdd = () => { setEditing(null); setFormError(''); setForm({ name: '', subjectId: subjects[0]?.id, date: '', prep: 'Not Started' }); setModalOpen(true); };
  const openEdit = (e) => { setEditing(e.id); setFormError(''); setForm(e); setModalOpen(true); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name?.trim()) {
      setFormError('Please enter an exam name');
      return;
    }
    if (!form.date) {
      setFormError('Please select an exam date');
      return;
    }
    setFormError('');
    try {
      if (editing) await updateExam(editing, form);
      else await addExam(form);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save exam');
    }
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Stay Ahead</div>
          <div className="page-title">Exams</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Exam</button>
      </div>

      <Tabs tabs={[{ label: 'Upcoming', value: 'upcoming', count: upcoming.length }, { label: 'Completed', value: 'completed', count: completed.length }]} active={tab} onChange={setTab} />

      {list.length === 0 ? (
        <div className="panel"><EmptyState icon="🎓" title={tab === 'upcoming' ? 'No upcoming exams' : 'No completed exams'} /></div>
      ) : (
        <div className="grid grid-3">
          {list.map(e => {
            const left = daysLeft(e.date);
            return (
              <div key={e.id} className="panel panel-pad">
                <div className="flex justify-between items-start mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--coral-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LuGraduationCap size={18} color="var(--coral-deep)" />
                  </div>
                  <div className="flex gap-1">
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(e)}><LuPencil size={13} /></button>
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setDeleteConfirm(e)}><LuTrash2 size={13} color="var(--coral-deep)" /></button>
                  </div>
                </div>
                <div className="font-semibold mb-1" style={{ fontSize: 15, fontFamily: 'var(--font-display)' }}>{e.name}</div>
                <div className="text-xs muted mb-3">{subjectName(e.subjectId)} • {e.date}</div>
                {tab === 'upcoming' ? (
                  <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: left <= 3 ? 'var(--coral-deep)' : 'var(--ink)' }}>
                    {left === 0 ? 'Today' : `${left}d`}
                  </div>
                ) : null}
                <div className="mt-3"><Pill tone={prepTone[e.prep]}>{e.prep}</Pill></div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Exam' : 'Add Exam'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Exam'}</button>
        </>}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="text-xs mb-3" style={{ color: 'var(--coral-deep)', fontWeight: 600 }}>
              ⚠ {formError}
            </div>
          )}
          <div className="field">
            <label className="field-label">Exam Name <span style={{ color: 'var(--coral-deep)' }}>*</span></label>
            <input
              className="field-input"
              value={form.name || ''}
              onChange={e => { setForm({ ...form, name: e.target.value }); if (formError) setFormError(''); }}
              placeholder="e.g. Machine Learning End Term Exam"
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
              <label className="field-label">Date <span style={{ color: 'var(--coral-deep)' }}>*</span></label>
              <input
                type="date"
                className="field-input"
                value={form.date || ''}
                onChange={e => { setForm({ ...form, date: e.target.value }); if (formError) setFormError(''); }}
              />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Preparation Status</label>
            <select className="field-input" value={form.prep || 'Not Started'} onChange={e => setForm({ ...form, prep: e.target.value })}>
              <option>Not Started</option><option>In Progress</option><option>Completed</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Exam"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteExam(deleteConfirm.id); setDeleteConfirm(null); }}>Delete</button>
        </>}
      >
        <p className="text-sm">Delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
