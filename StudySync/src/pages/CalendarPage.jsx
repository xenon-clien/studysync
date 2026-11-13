import { useState } from 'react';
import Calendar from 'react-calendar';
import { useStudy } from '../context/StudyContext';
import { Pill, EmptyState } from '../components/ui';
import 'react-calendar/dist/Calendar.css';

const toISO = (d) => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
};

export default function CalendarPage() {
  const { tasks, exams, assignments, subjects } = useStudy();
  const [selected, setSelected] = useState(new Date());

  const subjectName = (id) => subjects.find(s => s.id === id)?.name || '—';

  const eventsByDate = {};
  tasks.forEach(t => {
    if (!t.deadline) return;
    (eventsByDate[t.deadline] ||= []).push({ type: 'task', label: t.name, tone: 'amber' });
  });
  exams.forEach(e => {
    (eventsByDate[e.date] ||= []).push({ type: 'exam', label: e.name, tone: 'coral' });
  });
  assignments.forEach(a => {
    (eventsByDate[a.dueDate] ||= []).push({ type: 'assignment', label: a.title, tone: 'slate' });
  });

  const selectedKey = toISO(selected);
  const dayEvents = eventsByDate[selectedKey] || [];

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Calendar</div>
        <div className="page-title">Deadlines at a Glance</div>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>
        <div className="panel panel-pad">
          <Calendar
            onChange={setSelected}
            value={selected}
            tileContent={({ date }) => {
              const key = toISO(date);
              const evts = eventsByDate[key];
              if (!evts) return null;
              return (
                <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 3 }}>
                  {evts.slice(0, 3).map((e, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: e.tone === 'coral' ? 'var(--coral)' : e.tone === 'slate' ? 'var(--slate)' : 'var(--amber)' }} />
                  ))}
                </div>
              );
            }}
          />
        </div>

        <div className="panel">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
            <div className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
              {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-xs muted">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</div>
          </div>
          {dayEvents.length === 0 ? (
            <EmptyState icon="📅" title="Nothing on this day" />
          ) : (
            <div className="row-list">
              {dayEvents.map((e, i) => (
                <div key={i} className="row-item">
                  <div style={{ flex: 1 }}>
                    <div className="text-sm font-semibold">{e.label}</div>
                  </div>
                  <Pill tone={e.tone}>{e.type}</Pill>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .react-calendar { width: 100%; border: none; background: transparent; font-family: var(--font-body); }
        .react-calendar__navigation button { color: var(--ink); font-weight: 600; font-size: 14px; border-radius: 8px; }
        .react-calendar__navigation button:hover { background: var(--amber-wash); }
        .react-calendar__month-view__weekdays { font-size: 11px; text-transform: uppercase; color: var(--ink-faint); font-weight: 700; }
        .react-calendar__month-view__weekdays abbr { text-decoration: none; }
        .react-calendar__tile { border-radius: 10px; padding: 10px 6px; color: var(--ink); font-size: 13px; position: relative; }
        .react-calendar__tile:hover { background: var(--amber-wash); }
        .react-calendar__tile--now { background: var(--slate-wash); font-weight: 700; }
        .react-calendar__tile--active { background: var(--amber) !important; color: #1B1304 !important; font-weight: 700; }
        .react-calendar__month-view__days__day--neighboringMonth { opacity: .35; }
      `}</style>
    </div>
  );
}
