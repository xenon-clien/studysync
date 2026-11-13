import { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Tabs } from '../components/ui';
import { LuSun, LuMoon, LuBell, LuSave, LuDatabase, LuRefreshCw, LuCheck } from 'react-icons/lu';

export default function SettingsPage() {
  const {
    user, updateProfile, darkMode, setDarkMode,
    subjects, tasks, schedule, goals, assignments, exams, notes,
    seedSampleData, refreshAllData
  } = useStudy();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    }
  };

  const requestNotif = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') new Notification('StudySync', { body: 'Notifications are now enabled!' });
      });
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    try {
      await seedSampleData();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to populate dataset');
    } finally {
      setSeeding(false);
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await refreshAllData();
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Preferences</div>
        <div className="page-title">Settings</div>
      </div>

      <Tabs
        tabs={[
          { label: 'Profile', value: 'profile' },
          { label: 'Appearance', value: 'appearance' },
          { label: 'Notifications', value: 'notifications' },
          { label: 'Database & Sync', value: 'database' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'profile' && (
        <form onSubmit={handleSave} className="panel panel-pad" style={{ maxWidth: 480 }}>
          <div className="field mb-4">
            <label className="field-label">Full Name</label>
            <input className="field-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field mb-4">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          {error && <div className="text-xs mb-4" style={{ color: 'var(--coral-deep)' }}>{error}</div>}
          <button type="submit" className="btn btn-primary"><LuSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}</button>
        </form>
      )}

      {tab === 'appearance' && (
        <div className="panel panel-pad" style={{ maxWidth: 480 }}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">Theme</div>
              <div className="text-xs muted">Choose between a light, paper-like look or a focused dark mode.</div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className="btn"
              style={{ flex: 1, justifyContent: 'center', border: !darkMode ? '2px solid var(--amber)' : '1.5px solid var(--line)', background: !darkMode ? 'var(--amber-wash)' : 'transparent' }}
              onClick={() => setDarkMode(false)}
            >
              <LuSun size={15} /> Light
            </button>
            <button
              className="btn"
              style={{ flex: 1, justifyContent: 'center', border: darkMode ? '2px solid var(--amber)' : '1.5px solid var(--line)', background: darkMode ? 'var(--amber-wash)' : 'transparent' }}
              onClick={() => setDarkMode(true)}
            >
              <LuMoon size={15} /> Dark
            </button>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="panel panel-pad" style={{ maxWidth: 480 }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-semibold text-sm flex items-center gap-2"><LuBell size={14} /> Browser Notifications</div>
              <div className="text-xs muted">Get reminders for task deadlines, exams, and study sessions.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 42, height: 24, flexShrink: 0 }}>
              <input type="checkbox" checked={notifEnabled} onChange={e => setNotifEnabled(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, background: notifEnabled ? 'var(--amber)' : 'var(--line-strong)', borderRadius: 24, transition: '.2s' }}>
                <span style={{ position: 'absolute', height: 18, width: 18, left: notifEnabled ? 21 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '.2s' }} />
              </span>
            </label>
          </div>
          <button className="btn btn-ghost btn-block" onClick={requestNotif}>Enable Browser Permission</button>
          <div className="text-xs muted mt-3">Reminder types: task due dates, exam countdowns, and daily study session prompts.</div>
        </div>
      )}

      {tab === 'database' && (
        <div style={{ maxWidth: 640 }}>
          <div className="panel panel-pad mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <LuDatabase size={16} color="var(--amber-deep)" /> MongoDB Live Connection
                </div>
                <div className="text-xs muted mt-1">Status: Active & Connected on port 3001</div>
              </div>
              <div className="pill pill-sage flex items-center gap-1.5" style={{ fontSize: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <span>Connected</span>
              </div>
            </div>

            <div className="grid grid-3 gap-2 mt-4" style={{ background: 'var(--paper-subtle, rgba(0,0,0,0.03))', padding: '12px', borderRadius: 8 }}>
              <div className="text-xs"><strong>Subjects:</strong> {subjects.length} in DB</div>
              <div className="text-xs"><strong>Tasks:</strong> {tasks.length} in DB</div>
              <div className="text-xs"><strong>Planner Blocks:</strong> {schedule.length} in DB</div>
              <div className="text-xs"><strong>Goals:</strong> {goals.length} in DB</div>
              <div className="text-xs"><strong>Assignments:</strong> {assignments.length} in DB</div>
              <div className="text-xs"><strong>Exams:</strong> {exams.length} in DB</div>
              <div className="text-xs"><strong>Notes:</strong> {notes.length} in DB</div>
            </div>
          </div>

          <div className="panel panel-pad">
            <div className="font-semibold text-sm mb-1">Full B.Tech CSE Study Dataset</div>
            <div className="text-xs muted mb-4">
              Instantly populate or refresh your account with complete B.Tech CSE Semester subjects (Machine Learning, Discrete Structures, DBMS, OS, Compiler Design, Networks), today's daily planner study blocks, assignments, exams, and notes.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSeedData}
                disabled={seeding}
              >
                <LuRefreshCw size={14} className={seeding ? 'animate-spin' : ''} />
                {seeding ? 'Syncing to MongoDB...' : seedSuccess ? 'Database Populated! ✓' : 'Populate Full B.Tech Study Database'}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleRefreshData}
                disabled={refreshing}
              >
                <LuRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh from DB'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
