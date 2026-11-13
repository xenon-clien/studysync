import { NavLink, useNavigate } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';
import {
  LuLayoutGrid, LuBookOpen, LuListChecks, LuCalendarDays, LuTimer,
  LuTarget, LuStickyNote, LuGraduationCap, LuClipboardList,
  LuSettings, LuLogOut, LuFlame, LuX, LuBookMarked, LuBookOpenCheck
} from 'react-icons/lu';

const NAV = [
  { section: 'Overview', items: [
    { to: '/app', label: 'Dashboard', icon: LuLayoutGrid, end: true },
  ]},
  { section: 'Study', items: [
    { to: '/app/subjects', label: 'Subjects', icon: LuBookOpen },
    { to: '/app/tasks', label: 'Tasks', icon: LuListChecks },
    { to: '/app/planner', label: 'Daily Planner', icon: LuCalendarDays },
    { to: '/app/timer', label: 'Pomodoro Timer', icon: LuTimer },
    { to: '/app/calendar', label: 'Calendar', icon: LuCalendarDays },
  ]},
  { section: 'Track', items: [
    { to: '/app/goals', label: 'Goals', icon: LuTarget },
    { to: '/app/exams', label: 'Exams', icon: LuGraduationCap },
    { to: '/app/exam-prep', label: 'Exam Prep Hub', icon: LuBookOpenCheck },
    { to: '/app/assignments', label: 'Assignments', icon: LuClipboardList },
    { to: '/app/notes', label: 'Notes', icon: LuStickyNote },
    { to: '/app/analytics', label: 'Analytics', icon: LuBookMarked },
  ]},
];

export default function Sidebar() {
  const { user, logout, sidebarOpen, setSidebarOpen, streak } = useStudy();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside
      className="sidebar-shell"
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 'var(--sidebar-w)',
        background: 'var(--paper-raised)', borderRight: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column', zIndex: 100, overflowY: 'auto',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .25s ease'
      }}
    >
      <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#1B1304' }}>
          S
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.1 }}>StudySync</div>
          <div className="text-xs muted">Smart Study Planner</div>
        </div>
        <button className="btn btn-icon btn-ghost" style={{ marginLeft: 'auto', display: 'none' }} onClick={() => setSidebarOpen(false)} id="sidebar-x"><LuX size={15} /></button>
      </div>

      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div className="flex items-center gap-2" style={{ background: 'var(--amber-wash)', padding: '8px 12px', borderRadius: 10 }}>
          <LuFlame size={16} color="var(--amber-deep)" />
          <span className="text-sm font-semibold" style={{ color: 'var(--amber-deep)' }}>{streak.current}-day streak</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 0' }}>
        {NAV.map(section => (
          <div key={section.section} style={{ padding: '10px 14px 0' }}>
            <div className="text-xs font-bold" style={{ color: 'var(--ink-faint)', letterSpacing: '.06em', textTransform: 'uppercase', padding: '4px 10px 8px' }}>{section.section}</div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidenav-item ${isActive ? 'sidenav-active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                  borderRadius: 9, fontSize: 13.5, fontWeight: 500, marginBottom: 2,
                  color: isActive ? 'var(--amber-deep)' : 'var(--ink-soft)',
                  background: isActive ? 'var(--amber-wash)' : 'transparent',
                })}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: 12, borderTop: '1px solid var(--line)' }}>
        <div className="flex items-center gap-3" style={{ padding: '8px 8px 14px' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="font-semibold text-sm truncate">{user?.name}</div>
            <div className="text-xs muted truncate">{user?.email}</div>
          </div>
        </div>
        <NavLink to="/app/settings" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, fontSize: 13.5, color: 'var(--ink-soft)' }}>
          <LuSettings size={16} /> Settings
        </NavLink>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 9, fontSize: 13.5, color: 'var(--coral-deep)', width: '100%', textAlign: 'left', background: 'none', border: 'none' }}>
          <LuLogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
