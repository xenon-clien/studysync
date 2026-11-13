import { Link } from 'react-router-dom';
import { LuArrowRight, LuTimer, LuFlame, LuTarget, LuChartBar, LuCalendarDays, LuStickyNote } from 'react-icons/lu';

const FEATURES = [
  { icon: LuTimer, title: 'Pomodoro Timer', desc: '25-minute focus sprints with built-in breaks, tracked automatically.' },
  { icon: LuCalendarDays, title: 'Daily Planner', desc: 'Block your day hour by hour and never wonder what\'s next.' },
  { icon: LuTarget, title: 'Goal Tracking', desc: 'Set targets like "Finish React in 30 Days" and watch the progress climb.' },
  { icon: LuFlame, title: 'Study Streaks', desc: 'A simple daily habit loop that keeps momentum from quietly dying.' },
  { icon: LuChartBar, title: 'Real Analytics', desc: 'Subject-wise hours, weekly trends, and completion rates — not vanity stats.' },
  { icon: LuStickyNote, title: 'Notes & Exams', desc: 'Keep lecture notes and exam countdowns in the same place you plan.' },
];

const STEPS = [
  { n: '01', title: 'Add your subjects', desc: 'JavaScript, DSA, whatever you\'re learning — set a goal in hours.' },
  { n: '02', title: 'Plan today', desc: 'Drop tasks into your daily planner with priority and deadline.' },
  { n: '03', title: 'Run the timer', desc: 'Start a focus session. StudySync logs it to the right subject automatically.' },
  { n: '04', title: 'Watch the streak grow', desc: 'Come back tomorrow. That\'s the whole trick.' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,247,242,.92)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--line)', padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1B1304' }}>S</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>StudySync</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started <LuArrowRight size={14} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '90px 40px 70px', maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
        <div className="page-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>The smart study planner</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.08, marginBottom: 22, letterSpacing: '-0.02em' }}>
          Stop guessing<br />what to study next.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Subjects, tasks, a Pomodoro timer, and a streak that actually holds you accountable — all in one calm, paper-quiet workspace.
        </p>
        <div className="flex gap-3" style={{ justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg">Start Studying Free <LuArrowRight size={15} /></Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
        </div>

        {/* Hero visual: mini dashboard mock */}
        <div className="panel fade-in" style={{ marginTop: 56, padding: 24, textAlign: 'left', boxShadow: 'var(--shadow-lg)' }}>
          <div className="grid grid-3">
            <div className="panel panel-pad" style={{ background: 'var(--amber-wash)', border: 'none' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--amber-deep)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Today's Focus</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, marginTop: 8 }}>02:14:30</div>
              <div className="text-xs muted mt-2">3 sessions completed</div>
            </div>
            <div className="panel panel-pad" style={{ background: 'var(--sage-wash)', border: 'none' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--sage-deep)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Streak</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginTop: 8 }}>12 days</div>
              <div className="text-xs muted mt-2">Longest: 30 days</div>
            </div>
            <div className="panel panel-pad" style={{ background: 'var(--coral-wash)', border: 'none' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--coral-deep)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Due Today</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginTop: 8 }}>4 tasks</div>
              <div className="text-xs muted mt-2">1 high priority</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 40px', background: 'var(--paper-raised)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="page-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Everything you need</div>
            <h2 style={{ fontSize: 32 }}>One planner, every study habit</h2>
          </div>
          <div className="grid grid-3">
            {FEATURES.map(f => (
              <div key={f.title} className="panel panel-pad">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--amber-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <f.icon size={18} color="var(--amber-deep)" />
                </div>
                <div className="font-semibold" style={{ fontSize: 15.5, marginBottom: 6 }}>{f.title}</div>
                <div className="text-sm soft" style={{ lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="page-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>How it works</div>
            <h2 style={{ fontSize: 32 }}>Four steps. Every day.</h2>
          </div>
          <div className="flex flex-col gap-3">
            {STEPS.map(s => (
              <div key={s.n} className="panel panel-pad flex items-center gap-4">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--amber-deep)', fontWeight: 700, width: 28, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div className="font-semibold" style={{ fontSize: 15 }}>{s.title}</div>
                  <div className="text-sm muted">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '70px 40px', background: 'var(--ink)', color: 'var(--paper)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, marginBottom: 16, color: 'var(--paper)' }}>Your next study session starts now.</h2>
        <p style={{ color: '#B8BCC4', marginBottom: 28 }}>Free to use. No credit card. Just you and the work.</p>
        <Link to="/register" className="btn btn-accent btn-lg">Create Free Account <LuArrowRight size={15} /></Link>
      </section>

      <footer style={{ padding: '28px 40px', textAlign: 'center', color: 'var(--ink-faint)', fontSize: 13 }}>
        © 2026 StudySync. Built for focused minds.
      </footer>
    </div>
  );
}
