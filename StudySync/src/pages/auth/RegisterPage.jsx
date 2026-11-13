import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';
import { AuthShell } from './LoginPage';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export default function RegisterPage() {
  const { register } = useStudy();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    const trimmedEmail = form.email.trim();
    if (!form.name.trim()) e.name = 'Name is required';
    if (!trimmedEmail) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/app');
    } catch (err) {
      setErrors({ api: err.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="page-eyebrow">Get started</div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h1>
      <p className="text-sm muted" style={{ marginBottom: 28 }}>Set up your study space in under a minute.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="field">
          <label className="field-label">Full Name</label>
          <input className="field-input" placeholder="Jordan Lee" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          {errors.name && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.name}</span>}
        </div>
        <div className="field">
          <label className="field-label">Email</label>
          <input className="field-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {errors.email && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.email}</span>}
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 38 }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-faint)' }}>
              {showPw ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>
          </div>
          {errors.password && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.password}</span>}
        </div>
        <div className="field">
          <label className="field-label">Confirm Password</label>
          <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
          {errors.confirm && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.confirm}</span>}
        </div>

        {errors.api && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{errors.api}</span>}
        <button type="submit" className="btn btn-primary btn-lg btn-block">Create Account</button>
      </form>

      <p className="text-sm muted" style={{ textAlign: 'center', marginTop: 22 }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}
