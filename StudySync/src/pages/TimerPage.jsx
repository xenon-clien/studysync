import { useState, useEffect, useRef, useCallback } from 'react';
import { useStudy } from '../context/StudyContext';
import { LuPlay, LuPause, LuRotateCcw, LuCoffee, LuBrain } from 'react-icons/lu';

const FOCUS_MIN = 25;
const BREAK_MIN = 5;
const RADIUS = 120;
const CIRC = 2 * Math.PI * RADIUS;

export default function TimerPage() {
  const { pomodoroStats, logPomodoroSession, subjects } = useStudy();
  const [mode, setMode] = useState('focus'); // focus | break
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const [activeSubject, setActiveSubject] = useState(subjects[0]?.id || '');
  const intervalRef = useRef(null);

  const totalSeconds = (mode === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const dashOffset = CIRC * (1 - progress);

  const tick = useCallback(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        if (mode === 'focus') logPomodoroSession(FOCUS_MIN, activeSubject);
        const nextMode = mode === 'focus' ? 'break' : 'focus';
        setMode(nextMode);
        setRunning(false);
        clearInterval(intervalRef.current);
        return (nextMode === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60;
      }
      return prev - 1;
    });
  }, [mode, activeSubject, logPomodoroSession]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const toggleRun = () => setRunning(r => !r);
  const reset = () => { setRunning(false); setSecondsLeft(totalSeconds); };
  const switchMode = (m) => { setRunning(false); setMode(m); setSecondsLeft((m === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60); };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const ringColor = mode === 'focus' ? '#E8A33D' : '#7A9B76';

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Focus Session</div>
        <div className="page-title">Pomodoro Timer</div>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1fr 360px', alignItems: 'start' }}>
        <div className="panel panel-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
          <div className="flex gap-2 mb-8">
            <button className={`tab-btn ${mode === 'focus' ? 'active' : ''}`} onClick={() => switchMode('focus')} style={{ border: '1.5px solid var(--line)', borderRadius: 20, padding: '7px 18px' }}>
              <LuBrain size={13} style={{ marginRight: 5, display: 'inline' }} /> Focus
            </button>
            <button className={`tab-btn ${mode === 'break' ? 'active' : ''}`} onClick={() => switchMode('break')} style={{ border: '1.5px solid var(--line)', borderRadius: 20, padding: '7px 18px' }}>
              <LuCoffee size={13} style={{ marginRight: 5, display: 'inline' }} /> Break
            </button>
          </div>

          {/* Circular dial — signature element */}
          <div style={{ position: 'relative', width: 280, height: 280 }}>
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="140" cy="140" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="14" />
              <circle
                cx="140" cy="140" r={RADIUS} fill="none"
                stroke={ringColor} strokeWidth="14" strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none' }}
              />
              {/* tick marks like a kitchen timer */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * 2 * Math.PI;
                const x1 = 140 + (RADIUS - 18) * Math.cos(angle);
                const y1 = 140 + (RADIUS - 18) * Math.sin(angle);
                const x2 = 140 + (RADIUS - 10) * Math.cos(angle);
                const y2 = 140 + (RADIUS - 10) * Math.sin(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-strong)" strokeWidth="2" />;
              })}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="mono" style={{ fontSize: 52, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px' }}>{mm}:{ss}</div>
              <div className="text-xs muted" style={{ textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>{mode === 'focus' ? 'Stay focused' : 'Take a breather'}</div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="btn btn-icon btn-ghost btn-lg" onClick={reset}><LuRotateCcw size={18} /></button>
            <button
              className="btn btn-lg"
              style={{ background: ringColor, color: mode === 'focus' ? '#1B1304' : 'white', width: 90, justifyContent: 'center' }}
              onClick={toggleRun}
            >
              {running ? <LuPause size={20} /> : <LuPlay size={20} />}
            </button>
            <div style={{ width: 42 }} />
          </div>

          {mode === 'focus' && (
            <div className="field mt-8" style={{ width: '100%', maxWidth: 280 }}>
              <label className="field-label">Studying</label>
              <select className="field-input" value={activeSubject} onChange={e => setActiveSubject(e.target.value)}>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="panel panel-pad">
            <div className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>Today's Statistics</div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm muted">Sessions completed</span>
              <span className="font-bold" style={{ fontSize: 18 }}>{pomodoroStats.todaySessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm muted">Total focus time</span>
              <span className="font-bold" style={{ fontSize: 18 }}>{(pomodoroStats.totalFocusMinutes / 60).toFixed(1)}h</span>
            </div>
          </div>

          <div className="panel panel-pad" style={{ background: 'var(--amber-wash)' }}>
            <div className="font-semibold mb-2" style={{ color: 'var(--amber-deep)', fontSize: 14 }}>How it works</div>
            <ul className="text-sm soft" style={{ paddingLeft: 18, lineHeight: 1.8 }}>
              <li>25 minutes of deep focus</li>
              <li>5 minute break to reset</li>
              <li>Sessions auto-log to your stats</li>
              <li>Completing a focus session adds to your streak</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
