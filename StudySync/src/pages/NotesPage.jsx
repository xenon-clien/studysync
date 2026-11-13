import { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Modal, SearchInput, EmptyState } from '../components/ui';
import VisualDiagram from '../components/ui/VisualDiagram';
import { LuPlus, LuPencil, LuTrash2, LuStickyNote } from 'react-icons/lu';

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, subjects } = useStudy();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewing, setViewing] = useState(null);

  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setFormError(''); setForm({ title: '', subject: subjects[0]?.name || '', content: '' }); setModalOpen(true); };
  const openEdit = (n) => { setEditing(n.id); setFormError(''); setForm(n); setModalOpen(true); setViewing(null); };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.title?.trim()) {
      setFormError('Please enter a note title');
      return;
    }
    setFormError('');
    try {
      if (editing) await updateNote(editing, form);
      else await addNote(form);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save note');
    }
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Capture It</div>
          <div className="page-title">Notes</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><LuPlus size={15} /> Add Note</button>
      </div>

      <div className="mb-6"><SearchInput value={search} onChange={setSearch} placeholder="Search notes..." /></div>

      {filtered.length === 0 ? (
        <div className="panel"><EmptyState icon="🗒️" title="No notes found" /></div>
      ) : (
        <div className="grid grid-3">
          {filtered.map(n => (
            <div key={n.id} className="panel panel-pad fade-in" style={{ cursor: 'pointer' }} onClick={() => setViewing(n)}>
              <div className="flex justify-between items-start mb-3">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--amber-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuStickyNote size={16} color="var(--amber-deep)" />
                </div>
                <span className="pill pill-slate">{n.subject}</span>
              </div>
              <div className="font-semibold mb-2" style={{ fontSize: 15 }}>{n.title}</div>
              <div className="text-sm soft" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{n.content}</div>
              <div className="text-xs muted mt-3">Updated {n.updatedAt}</div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title}
        footer={<>
          <button className="btn btn-danger" onClick={() => { setDeleteConfirm(viewing); setViewing(null); }}><LuTrash2 size={13} /> Delete</button>
          <button className="btn btn-primary" onClick={() => openEdit(viewing)}><LuPencil size={13} /> Edit</button>
        </>}
      >
        {viewing && (
          <div>
            <span className="pill pill-slate mb-3" style={{ display: 'inline-flex' }}>{viewing.subject}</span>
            <VisualDiagram
              type={viewing.title + ' ' + (viewing.subject || '')}
              title={`${viewing.title} Visual Diagram`}
              caption="Interactive architecture / formula diagram matching your study note"
            />
            <p className="text-sm" style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewing.content}</p>
            <div className="text-xs muted mt-4">Last updated {viewing.updatedAt}</div>
          </div>
        )}
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Note' : 'Add Note'}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Note'}</button>
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
              placeholder="e.g. React Hooks Notes"
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field-label">Subject</label>
            <select className="field-input" value={form.subject || ''} onChange={e => setForm({ ...form, subject: e.target.value })}>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Content</label>
            <textarea className="field-input" rows={6} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your notes here..." />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Note"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteNote(deleteConfirm.id); setDeleteConfirm(null); }}>Delete</button>
        </>}
      >
        <p className="text-sm">Delete <strong>{deleteConfirm?.title}</strong>?</p>
      </Modal>
    </div>
  );
}
