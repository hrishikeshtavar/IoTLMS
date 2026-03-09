'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { ok, data } = await login(email, password);
      if (!ok) {
        setError(data.message || 'Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>IoTLearn</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to continue learning</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@school.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          <a href='/forgot-password' style={styles.link}>Forgot password?</a>
        </p>
        <p style={styles.footer}>
          Don&apos;t have an account?{' '}
          <a href="/register" style={styles.link}>Create one</a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '1rem',
  },
  card: {
    background: 'var(--card)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
    border: '1px solid var(--border)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  logoIcon: { fontSize: '1.75rem' },
  logoText: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--text3)', marginBottom: '1.75rem', fontSize: '0.95rem' },
  error: {
    background: '#FEE2E2',
    color: '#DC2626',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: 'var(--text2)' },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1.5px solid var(--border)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    background: 'var(--bg)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  footer: { marginTop: '1.5rem', textAlign: 'center', color: 'var(--text3)', fontSize: '0.9rem' },
  link: { color: 'var(--primary)', fontWeight: 700 },
};
