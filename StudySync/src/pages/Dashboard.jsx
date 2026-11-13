import { useStudy } from '../context/StudyContext';
import { Link } from 'react-router-dom';
import { StatCard, ProgressBar, Pill, priorityTone, CheckBox } from '../components/ui';
import { LuBookOpen, LuListChecks, LuCircleCheck, LuClock, LuFlame, LuArrowRight } from 'react-icons/lu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WEEKLY = [
  { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.2 }, { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.0 }, { day: 'Fri', hours: 2.1 }, { day: 'Sat', hours: 3.6 }, { day: 'Sun', hours: 1.5 },
];

export default function Dashboard() {
  const { user, subjects, tasks, toggleTaskComplete, streak, pomodoroStats, schedule } = useStudy();

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.length - completed;
  const todayTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 5);
  const todaySchedule = schedule.slice(0, 4);
  const subjectColorOf = (id) => subjects.find(s => s.id === id)?.color || 'var(--amber)';
  const subjectNameOf = (id) => subjects.find(s => s.id === id)?.name || 'General';

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div className="page-title">Hey {user?.name?.split(' ')[0]}, ready to focus?</div>
      </div>

      <div className="grid grid-4 mb-6">
        <StatCard label="Subjects" value={subjects.length} icon={LuBookOpen} accent="amber" />
        <StatCard label="Total Tasks" value={tasks.length} icon={LuListChecks} accent="slate" />
        <StatCard label="Completed" value={completed} icon={LuCircleCheck} accent="sage" sub={`${pending} pending`} />
        <StatCard label="Today's Focus" value={`${Math.round(pomodoroStats.totalFocusMinutes / 60)}h`} icon={LuClock} accent="coral" sub={`${pomodoroStats.todaySessions} sessions today`} />
      </div>

      <div className="grid grid-2 mb-6" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <div className="panel panel-pad">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>This Week's Focus</div>
            <Pill tone="amber">{WEEKLY.reduce((s, d) => s + d.hours, 0).toFixed(1)}h total</Pill>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEEKLY}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A33D" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#E8A33D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--line)', fontSize: 13 }} />
              <Area type="monotone" dataKey="hours" stroke="#E8A33D" strokeWidth={2.5} fill="url(#focusGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel panel-pad" style={{ background: 'linear-gradient(155deg, var(--ink) 0%, #2A3242 100%)', color: 'var(--paper)' }}>
          <div className="flex items-center gap-2 mb-2">
            <LuFlame size={18} color="#E8A33D" />
            <span className="text-sm font-semibold" style={{ color: '#E8A33D', textTransform: 'uppercase', letterSpacing: '.04em' }}>Current Streak</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{streak.current}</div>
          <div className="text-sm" style={{ color: '#B8BCC4', marginBottom: 18 }}>days in a row</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.12)', margin: '14px 0' }} />
          <div className="flex justify-between text-sm">
            <span style={{ color: '#8A8F98' }}>Longest streak</span>
            <span className="font-semibold">{streak.longest} days</span>
          </div>
          <Link to="/app/timer" className="btn btn-accent btn-block mt-4">Start a Session</Link>
        </div>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <div className="panel">
          <div className="flex justify-between items-center" style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
            <div className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Today's Tasks</div>
            <Link to="/app/tasks" className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--amber-deep)' }}>View all <LuArrowRight size={13} /></Link>
          </div>
          <div className="row-list">
            {todayTasks.length === 0 ? (
              <div className="empty"><div className="empty-icon">✅</div><div className="empty-title">All caught up</div></div>
            ) : todayTasks.map(t => (
              <div key={t.id} className="row-item">
                <CheckBox checked={t.status === 'Completed'} onChange={() => toggleTaskComplete(t.id)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm font-semibold truncate" style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none', opacity: t.status === 'Completed' ? .5 : 1 }}>{t.name}</div>
                  <div className="text-xs muted">{subjectNameOf(t.subjectId)} • Due {t.deadline}</div>
                </div>
                <Pill tone={priorityTone(t.priority)}>{t.priority}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex justify-between items-center" style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
            <div className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Today's Plan</div>
            <Link to="/app/planner" className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--amber-deep)' }}>Planner <LuArrowRight size={13} /></Link>
          </div>
          <div className="row-list">
            {todaySchedule.map(s => (
              <div key={s.id} className="row-item">
                <div style={{ width: 4, height: 30, borderRadius: 3, background: 'var(--amber)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm font-semibold truncate">{s.title}</div>
                  <div className="text-xs muted">{s.subject}</div>
                </div>
                <span className="text-xs font-semibold mono">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel panel-pad mt-6">
        <div className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Subject Progress</div>
        <div className="grid grid-2">
          {subjects.map(s => (
            <div key={s.id}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="text-xs muted">{s.loggedHours}/{s.goalHours}h</span>
              </div>
              <ProgressBar value={s.loggedHours} max={s.goalHours} color={s.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
