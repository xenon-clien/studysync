import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';
import { LuEye, LuEyeOff, LuArrowLeft } from 'react-icons/lu';

export default function LoginPage() {
  const { login } = useStudy();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 4) e.password = 'Password is too short';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate('/app');
    } catch (err) {
      setErrors({ api: err.message || 'Invalid credentials' });
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setErrors({});
    setForm({ email: 'demo@studysync.app', password: 'demo1234' });
  };

  return (
    <AuthShell>
      <div className="page-eyebrow">Welcome back</div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Sign in to StudySync</h1>
      <p className="text-sm muted" style={{ marginBottom: 28 }}>Pick up your study plan right where you left off.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="field">
          <label className="field-label">Email</label>
          <input className="field-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {errors.email && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.email}</span>}
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 38 }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-faint)' }}>
              {showPw ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>
          </div>
          {errors.password && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.password}</span>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm soft" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold" style={{ color: 'var(--amber-deep)' }}>Forgot password?</Link>
        </div>

        {errors.api && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.api}</span>}
        <button type="submit" className="btn btn-primary btn-lg btn-block">Sign In</button>
        <button type="button" className="btn btn-ghost btn-block" onClick={fillDemo}>Use Demo Credentials</button>
      </form>

      <p className="text-sm muted" style={{ textAlign: 'center', marginTop: 22 }}>
        New to StudySync? <Link to="/register" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
        <Link to="/" className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 24, left: 24 }}><LuArrowLeft size={14} /> Home</Link>
        <div style={{ width: '100%', maxWidth: 400 }} className="fade-in">
          {children}
        </div>
      </div>
      <div className="auth-visual" style={{
        flex: 1, background: 'linear-gradient(155deg, #1B2430 0%, #2A3242 55%, #3a3322 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(232,163,61,.12) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div style={{ position: 'relative', maxWidth: 380, color: '#FAF7F2' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#E8A33D', marginBottom: 16, letterSpacing: '.05em' }}>09:00 — REACT REVISION</div>
          <h2 style={{ fontSize: 34, lineHeight: 1.25, marginBottom: 16 }}>Study with intention, not just intensity.</h2>
          <p style={{ fontSize: 15, color: '#B8BCC4', lineHeight: 1.7 }}>
            Plan your day, track every subject, and build a streak you don't want to break.
          </p>
          <div className="flex gap-6 mt-8">
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>12</div>
              <div style={{ fontSize: 12, color: '#8A8F98' }}>Day streak</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>31h</div>
              <div style={{ fontSize: 12, color: '#8A8F98' }}>Focus this month</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>84%</div>
              <div style={{ fontSize: 12, color: '#8A8F98' }}>Tasks on time</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 860px) { .auth-visual { display: none !important; } }`}</style>
    </div>
  );
}
