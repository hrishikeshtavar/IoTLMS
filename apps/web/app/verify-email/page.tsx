'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyForm() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) return setStatus('error');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/auth/verify-email?token=` + token)
      .then(r => r.ok ? setStatus('success') : setStatus('error'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={styles.page}><div style={styles.card}>
      {status === 'loading' && <><div style={styles.icon}>⏳</div><h1 style={styles.title}>Verifying…</h1></>}
      {status === 'success' && <>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Email verified!</h1>
        <p style={styles.subtitle}>Your account is now active.</p>
        <a href="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Go to Login</a>
      </>}
      {status === 'error' && <>
        <div style={styles.icon}>❌</div>
        <h1 style={styles.title}>Verification failed</h1>
        <p style={styles.subtitle}>Link is invalid or expired.</p>
        <a href="/register" style={styles.link}>Register again</a>
      </>}
    </div></div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyForm /></Suspense>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' },
  card: { background: 'var(--card)', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)', textAlign: 'center' },
  icon: { fontSize: '3rem', marginBottom: '1rem' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text3)', marginBottom: '1rem' },
  link: { color: 'var(--primary)', fontWeight: 600 },
};
