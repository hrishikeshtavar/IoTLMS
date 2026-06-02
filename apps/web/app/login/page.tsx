'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser, login } from '../lib/auth';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('role') === 'admin') setRole('admin');

    const user = getUser();
    if (!user) return;

    if (user.role === 'super_admin') router.push('/super-admin');
    else if (user.role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  }, [router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { ok, data } = await login(email, password, role);
      if (!ok) {
        setError(data?.message || 'Invalid credentials');
        return;
      }

      const userRole = data?.user?.role;
      if (userRole === 'super_admin') router.push('/super-admin');
      else if (userRole === 'admin') router.push('/admin');
      else router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ height: 4, borderRadius: '12px 12px 0 0', background: 'linear-gradient(90deg,var(--primary),var(--secondary),#3FAB99,#B0D35A)', backgroundSize: '200%' }} />

        <div style={{ background: '#fff', borderRadius: '0 0 20px 20px', padding: '36px 40px 32px', boxShadow: '0 8px 40px rgba(26,115,232,0.1)', border: '1px solid var(--border)', borderTop: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)' }}>Welcome back</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text3)', fontWeight: 600 }}>Sign in to SimuLearning</div>
          </div>

          <div style={{ display: 'flex', background: 'var(--primary-light)', borderRadius: 12, padding: 4, marginBottom: 22, border: '1px solid var(--border)' }}>
            {([
              { key: 'student', label: 'Student' },
              { key: 'admin', label: 'School Admin' },
            ] as const).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setRole(item.key)}
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: 9,
                  border: 'none',
                  background: role === item.key ? 'var(--primary)' : 'transparent',
                  color: role === item.key ? '#fff' : 'var(--text2)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: 10, fontSize: '0.875rem', marginBottom: 18 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email or Username</label>
              <input
                className="login-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@yourschool.edu' : 'your@school.edu or username'}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: '1.5px solid var(--border)', fontSize: '0.95rem', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: '1.5px solid var(--border)', fontSize: '0.95rem', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ padding: '0 12px', borderRadius: 11, border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? '#94B8D9' : 'linear-gradient(135deg,var(--primary),var(--secondary))', color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer' }}
            >
              {loading ? 'Signing in...' : role === 'admin' ? 'Sign In as Admin' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
