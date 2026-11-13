import { useStudy } from '../context/StudyContext';
import { StatCard } from '../components/ui';
import { LuClock, LuCircleCheck, LuFlame, LuTrendingUp } from 'react-icons/lu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const WEEKLY_PROGRESS = [
  { week: 'Wk 1', hours: 9 }, { week: 'Wk 2', hours: 13 }, { week: 'Wk 3', hours: 11 },
  { week: 'Wk 4', hours: 17 }, { week: 'Wk 5', hours: 14 }, { week: 'Wk 6', hours: 19 },
];

export default function AnalyticsPage() {
  const { subjects, tasks, pomodoroStats, streak } = useStudy();

  const subjectHours = subjects.map(s => ({ name: s.name, hours: s.loggedHours, color: s.color }));
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.length - completed;
  const completionData = [
    { name: 'Completed', value: completed, color: '#7A9B76' },
    { name: 'Pending', value: pending, color: '#E8A33D' },
  ];

  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Progress Analytics</div>
        <div className="page-title">See What's Working</div>
      </div>

      <div className="grid grid-4 mb-6">
        <StatCard label="Total Focus Time" value={`${(pomodoroStats.totalFocusMinutes / 60).toFixed(1)}h`} icon={LuClock} accent="amber" />
        <StatCard label="Task Completion Rate" value={`${completionRate}%`} icon={LuCircleCheck} accent="sage" />
        <StatCard label="Current Streak" value={`${streak.current}d`} icon={LuFlame} accent="coral" />
        <StatCard label="Avg Weekly Hours" value="13.8h" icon={LuTrendingUp} accent="slate" />
      </div>

      <div className="grid grid-2 mb-6">
        <div className="panel panel-pad">
          <div className="font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Subject-Wise Study Hours</div>
          <div className="text-xs muted mb-4">Hours logged per subject</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--line)', fontSize: 13 }} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {subjectHours.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel panel-pad">
          <div className="font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Weekly Progress</div>
          <div className="text-xs muted mb-4">Study hours over the last 6 weeks</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WEEKLY_PROGRESS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--line)', fontSize: 13 }} />
              <Line type="monotone" dataKey="hours" stroke="#5B7B9A" strokeWidth={2.5} dot={{ fill: '#5B7B9A', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="panel panel-pad">
          <div className="font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Task Completion</div>
          <div className="text-xs muted mb-4">Completed vs. pending across all subjects</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={completionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {completionData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--line)', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel panel-pad">
          <div className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Subject Goal Progress</div>
          <div className="flex flex-col gap-4">
            {subjects.map(s => {
              const pct = s.goalHours ? Math.round((s.loggedHours / s.goalHours) * 100) : 0;
              return (
                <div key={s.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">{s.name}</span>
                    <span className="text-xs muted">{pct}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
