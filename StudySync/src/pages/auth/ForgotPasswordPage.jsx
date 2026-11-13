import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';
import { AuthShell } from './LoginPage';
import { LuMailCheck } from 'react-icons/lu';

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useStudy();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    try {
      const res = await forgotPassword(email);
      if (res?.resetToken) setResetToken(res.resetToken);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send reset link');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetToken.trim() || newPassword.length < 6) {
      setError('Enter a valid reset token and password (at least 6 characters)');
      return;
    }
    setError('');
    try {
      await resetPassword(resetToken.trim(), newPassword);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Password reset failed');
    }
  };

  return (
    <AuthShell>
      {!sent && !searchParams.get('token') ? (
        <>
          <div className="page-eyebrow">Reset password</div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Forgot your password?</h1>
          <p className="text-sm muted" style={{ marginBottom: 28 }}>Enter your email and we'll send a reset link.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {error && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{error}</span>}
            <button type="submit" className="btn btn-primary btn-lg btn-block">Send Reset Link</button>
          </form>
        </>
      ) : (
        <div className="fade-in">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--sage-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <LuMailCheck size={26} color="var(--sage-deep)" />
            </div>
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>Check your inbox</h1>
            <p className="text-sm muted">
              {email ? <>Reset instructions created for <strong style={{ color: 'var(--ink)' }}>{email}</strong>.</> : 'Enter your new password below.'}
            </p>
          </div>
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="field">
              <label className="field-label">Reset Token</label>
              <input className="field-input" placeholder="Paste reset token" value={resetToken} onChange={e => setResetToken(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">New Password</label>
              <input className="field-input" type="password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            {error && <span className="text-xs" style={{ color: 'var(--coral-deep)' }}>{error}</span>}
            <button type="submit" className="btn btn-primary btn-lg btn-block">Reset Password</button>
          </form>
        </div>
      )}
      <p className="text-sm muted" style={{ textAlign: 'center', marginTop: 22 }}>
        <Link to="/login" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
