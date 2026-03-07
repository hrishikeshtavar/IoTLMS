'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch, getUser, isLoggedIn } from '../../lib/auth';

type CertData = {
  studentName: string;
  courseName: string;
  completedDate: string;
  score: string;
  certId: string;
  school: string;
  primaryColor: string;
  logoUrl: string | null;
  certCode?: string;
};

export default function CertificatePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const courseIdParam = Array.isArray(courseId) ? courseId[0] : courseId;
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseIdParam) return;
    if (!isLoggedIn()) { router.push('/login'); return; }

    async function load() {
      try {
        const issueRes = await apiFetch(`/api/certificates/issue/${courseIdParam}`, { method: 'POST' });
        if (!issueRes.ok) {
          const err = await issueRes.json();
          setError(err.message || 'Could not issue certificate');
          setLoading(false);
          return;
        }
        const issued = await issueRes.json();
        const user = getUser();
        const analyticsRes = await apiFetch(`/api/analytics/certificate/${courseIdParam}/${user?.id ?? 'me'}`);
        const analytics = analyticsRes.ok ? await analyticsRes.json() : {};
        setCert({
          studentName: analytics.studentName ?? user?.name ?? 'Student',
          courseName: analytics.courseName ?? 'IoT Course',
          completedDate: new Date(issued.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          score: `${issued.score_pct}%`,
          certId: issued.cert_code,
          certCode: issued.cert_code,
          school: analytics.school ?? 'IoTLearn',
          primaryColor: analytics.primaryColor ?? '#FF6B35',
          logoUrl: analytics.logoUrl ?? null,
        });
      } catch {
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseIdParam, router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
        <p style={{ color: 'var(--text3)' }}>Generating your certificate…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <p style={{ color: '#DC2626', marginBottom: '1rem' }}>{error}</p>
        <Link href="/courses" className="btn-primary">Back to Courses</Link>
      </div>
    </div>
  );

  if (!cert) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => window.print()} className="btn-primary">🖨️ Print / Save PDF</button>
        <Link href="/courses" className="btn-secondary">← Back to Courses</Link>
        {cert.certCode && <Link href={`/verify/${cert.certCode}`} className="btn-secondary">🔍 Verify</Link>}
      </div>
      <div style={{ background: '#fff', width: '100%', maxWidth: '760px', borderRadius: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
        <div style={{ height: '6px', background: `linear-gradient(to right, ${cert.primaryColor}, #9333ea, #f97316)` }} />
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            {cert.logoUrl
              ? <img src={cert.logoUrl} alt="School" style={{ height: '48px', objectFit: 'contain' }} />
              : <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: cert.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff' }}>⚡</div>
            }
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: cert.primaryColor }}>IoTLearn LMS</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{cert.school}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Certificate of Completion</div>
          <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '2rem' }}>This is to certify that</div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1E293B', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>{cert.studentName}</div>
          <div style={{ width: '160px', height: '2px', background: cert.primaryColor, margin: '0 auto 2rem' }} />
          <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.75rem' }}>has successfully completed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: cert.primaryColor, marginBottom: '0.5rem' }}>{cert.courseName}</div>
          <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '2.5rem' }}>with a score of <strong style={{ color: '#16A34A' }}>{cert.score}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#334155' }}>IoTLearn</div>
              <div style={{ width: '120px', height: '1px', background: '#CBD5E1', margin: '6px auto' }} />
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Platform Director</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '4px' }}>Certificate ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{cert.certId}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '6px' }}>{cert.completedDate}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#334155' }}>{cert.school}</div>
              <div style={{ width: '120px', height: '1px', background: '#CBD5E1', margin: '6px auto' }} />
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>School Principal</div>
            </div>
          </div>
        </div>
        <div style={{ height: '6px', background: `linear-gradient(to right, #f97316, #9333ea, ${cert.primaryColor})` }} />
      </div>
      <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94A3B8' }}>प्रमाणपत्र — IoTLearn द्वारा जारी किया गया ✅</p>
    </main>
  );
}
