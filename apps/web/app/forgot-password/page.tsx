'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    await fetch(`${apiUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  }

  if (sent) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>📧</div>
        <h1 style={styles.title}>Check your email</h1>
        <p style={styles.subtitle}>If that email exists, a reset link has been sent.</p>
        <a href="/login" style={styles.link}>Back to login</a>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🔐</div>
        <h1 style={styles.title}>Forgot password?</h1>
        <p style={styles.subtitle}>Enter your email and we'll send a reset link.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@school.com" required style={styles.input} />
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <a href="/login" style={styles.link}>Back to login</a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' },
  card: { background: 'var(--card)', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)', textAlign: 'center' },
  icon: { fontSize: '3rem', marginBottom: '1rem' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text3)', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' },
  input: { padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text)', outline: 'none' },
  link: { color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' },
};
