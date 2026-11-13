import { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { LuMenu, LuSun, LuMoon, LuBell, LuFlame } from 'react-icons/lu';

export default function Navbar({ title, subtitle }) {
  const { darkMode, setDarkMode, notifications, markNotifRead, sidebarOpen, setSidebarOpen, streak } = useStudy();
  const [showNotif, setShowNotif] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      height: 64, background: 'var(--paper-raised)', borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 50, gap: 16
    }}>
      <div className="flex items-center gap-3">
        <button className="btn btn-icon btn-ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <LuMenu size={17} />
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display)' }}>{title}</div>
          {subtitle && <div className="text-xs muted">{subtitle}</div>}
        </div>
      </div>

      <div className="flex items-center gap-2" style={{ marginLeft: 'auto' }}>
        <div className="flex items-center gap-1.5 pill pill-sage" style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600 }} title="Backend API & MongoDB Connected on Port 3001">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          <span>MongoDB Live</span>
        </div>

        <div className="flex items-center gap-2 pill pill-amber" style={{ padding: '6px 12px' }}>
          <LuFlame size={13} /> {streak.current} days
        </div>

        <button className="btn btn-icon btn-ghost" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LuSun size={16} /> : <LuMoon size={16} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button className="btn btn-icon btn-ghost" style={{ position: 'relative' }} onClick={() => setShowNotif(!showNotif)}>
            <LuBell size={16} />
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)', border: '2px solid var(--paper-raised)' }} />
            )}
          </button>
          {showNotif && (
            <div className="panel fade-in" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 320, boxShadow: 'var(--shadow-lg)', zIndex: 200 }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontSize: 14 }}>Notifications</div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => markNotifRead(n.id)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', cursor: 'pointer', background: n.read ? 'transparent' : 'var(--amber-wash)' }}>
                    <div className="text-sm">{n.message}</div>
                    <div className="text-xs muted" style={{ marginTop: 3 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
