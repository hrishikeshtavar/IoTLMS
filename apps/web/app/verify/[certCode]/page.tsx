'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type VerifyResult = {
  valid: boolean;
  certCode: string;
  studentName: string;
  courseName: string;
  school: string;
  score: string;
  issuedAt: string;
};

export default function VerifyPage() {
  const { certCode } = useParams();
  const code = Array.isArray(certCode) ? certCode[0] : certCode;
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!code) return;
    fetch(`${API}/api/certificates/verify/${code}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(data => { if (data) setResult(data); setLoading(false); });
  }, [code, API]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--text3)' }}>Verifying certificate…</p>
    </div>
  );

  if (notFound) return (
    <div style={styles.page}>
      <div style={{ ...styles.card, borderTop: '4px solid #DC2626' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.5rem' }}>Certificate Not Found</h1>
        <p style={{ color: 'var(--text3)', marginBottom: '1.5rem' }}>The code <strong>{code}</strong> is not valid.</p>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </div>
  );

  if (!result) return null;

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, borderTop: '4px solid #16A34A' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Verified Certificate</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>{result.studentName}</h1>
        <p style={{ color: 'var(--text3)', marginBottom: '2rem' }}>has completed</p>
        <div style={{ background: 'var(--bg)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          {[
            { label: 'Course', value: result.courseName },
            { label: 'School', value: result.school },
            { label: 'Score', value: result.score },
            { label: 'Issued', value: new Date(result.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Certificate ID', value: result.certCode, mono: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text3)', fontWeight: 600 }}>{row.label}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontFamily: row.mono ? 'monospace' : 'inherit', fontWeight: row.mono ? 700 : 400 }}>{row.value}</span>
            </div>
          ))}
        </div>
        <Link href="/" className="btn-secondary">← IoTLearn Home</Link>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' },
  card: { background: 'var(--card)', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center' },
};
