'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) { setDone(true); setTimeout(() => router.push('/login'), 2000); }
    else setError('Invalid or expired link. Please request a new one.');
    setLoading(false);
  }

  if (done) return (
    <div style={styles.page}><div style={styles.card}>
      <div style={styles.icon}>✅</div>
      <h1 style={styles.title}>Password reset!</h1>
      <p style={styles.subtitle}>Redirecting to login…</p>
    </div></div>
  );

  return (
    <div style={styles.page}><div style={styles.card}>
      <div style={styles.icon}>🔑</div>
      <h1 style={styles.title}>Reset password</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" required minLength={8} style={styles.input} />
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" required style={styles.input} />
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </div></div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' },
  card: { background: 'var(--card)', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)', textAlign: 'center' },
  icon: { fontSize: '3rem', marginBottom: '1rem' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text3)', marginBottom: '1.5rem' },
  error: { background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text)', outline: 'none' },
};
