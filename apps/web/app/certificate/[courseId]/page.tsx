'use client';
import QRCode from 'qrcode';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { apiFetch, getUser, isLoggedIn } from '../../lib/auth';

type CertData = {
  studentName: string;
  courseName: string;
  completedDate: string;
  score: string;
  certId: string;
  certCode?: string;
  school: string;
  primaryColor: string;
  logoUrl: string | null;
  certTemplateUrl?: string | null;
  principalName?: string | null;
  principalSignatureUrl?: string | null;
  platformDirectorName?: string | null;
  platformDirectorSignatureUrl?: string | null;
};

export default function CertificatePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const courseIdParam = Array.isArray(courseId) ? courseId[0] : courseId;
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!courseIdParam) return;
    if (!isLoggedIn()) { router.push('/login'); return; }
    async function load() {
      try {
        const issueRes = await apiFetch(`/api/certificates/issue/${courseIdParam}`, { method: 'POST' });
        if (!issueRes.ok) { const e = await issueRes.json(); setError(e.message || 'Could not issue certificate'); setLoading(false); return; }
        const issued = await issueRes.json();
        const user = getUser();
        const analyticsRes = await apiFetch(`/api/analytics/certificate/${courseIdParam}/${user?.id ?? 'me'}`);
        const analytics = analyticsRes.ok ? await analyticsRes.json() : {};
        setCert({
          studentName: analytics.studentName && analytics.studentName !== 'Student' ? analytics.studentName : (user?.name ?? 'Student'),
          courseName: analytics.courseName ?? 'IoT Course',
          completedDate: new Date(issued.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          score: `${issued.score_pct}%`,
          certId: issued.cert_code,
          certCode: issued.cert_code,
          school: analytics.school ?? 'SimuLearning',
          primaryColor: analytics.primaryColor ?? '#FF6B35',
          logoUrl: analytics.logoUrl ?? null,
          certTemplateUrl: analytics.certTemplateUrl ?? null,
          principalName: analytics.principalName ?? null,
          principalSignatureUrl: analytics.principalSignatureUrl ?? null,
          platformDirectorName: analytics.platformDirectorName ?? 'SimuLearning',
          platformDirectorSignatureUrl: analytics.platformDirectorSignatureUrl ?? null,
        });
      } catch { setError('Failed to load certificate'); }
      finally { setLoading(false); }
    }
    load();
  }, [courseIdParam, router]);

  useEffect(() => {
    if (cert?.certCode) {
      QRCode.toDataURL(`${window.location.origin}/verify/${cert.certCode}`, { width: 120, margin: 1, color: { dark: '#1e293b', light: '#ffffff' } })
        .then(setQrDataUrl).catch(console.error);
    }
  }, [cert]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>🏆</div>
        <p style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>Generating your certificate…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
        <p style={{ color: '#dc2626', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</p>
        <Link href="/courses" style={{ padding: '10px 24px', borderRadius: 10, background: '#1A73E8', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>← Back to Courses</Link>
      </div>
    </div>
  );

  if (!cert) return null;

  const primary = cert.primaryColor || '#FF6B35';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0e4d4d 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cert-print, #cert-print * { visibility: visible; }
          #cert-print { position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Action bar */}
      <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeIn 0.5s ease' }}>
        <button onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 24px', borderRadius: 50, background: 'linear-gradient(135deg,#FF6B35,#f97316)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,53,0.4)' }}>
          🖨️ Print / Save PDF
        </button>
        <button onClick={() => router.push('/courses')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', borderRadius: 50, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
          ← Back to Courses
        </button>
        {qrDataUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px 16px', borderRadius: 50, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <img src={qrDataUrl} alt="QR" style={{ width: 32, height: 32, borderRadius: 4 }} />
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Scan to verify</span>
          </div>
        )}
        {cert.certCode && (
          <Link href={`/verify/${cert.certCode}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', borderRadius: 50, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', backdropFilter: 'blur(10px)' }}>
            🔍 Verify
          </Link>
        )}
      </div>

      {/* Certificate */}
      <div id="cert-print" style={{ width: '100%', maxWidth: 860, animation: 'fadeIn 0.6s ease 0.1s both' }}>
        <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative' }}>

          {/* Top gradient bar */}
          <div style={{ height: 8, background: `linear-gradient(to right, ${primary}, #9333ea, #06b6d4, ${primary})` }} />

          {/* Decorative corner ornaments */}
          <div style={{ position: 'absolute', top: 20, left: 20, width: 60, height: 60, borderTop: `3px solid ${primary}`, borderLeft: `3px solid ${primary}`, borderRadius: '4px 0 0 0', opacity: 0.4 }} />
          <div style={{ position: 'absolute', top: 20, right: 20, width: 60, height: 60, borderTop: `3px solid ${primary}`, borderRight: `3px solid ${primary}`, borderRadius: '0 4px 0 0', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: 20, left: 20, width: 60, height: 60, borderBottom: `3px solid ${primary}`, borderLeft: `3px solid ${primary}`, borderRadius: '0 0 0 4px', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderBottom: `3px solid ${primary}`, borderRight: `3px solid ${primary}`, borderRadius: '0 0 4px 0', opacity: 0.4 }} />

          {/* Watermark */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.03 }}>
            <div style={{ fontSize: '18rem', fontWeight: 900, color: primary, transform: 'rotate(-15deg)', userSelect: 'none' }}>🏆</div>
          </div>

          <div style={{ padding: '3rem 4rem', position: 'relative' }}>

            {/* Header: Logo + School name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <img src="/simusoft-badge.svg" alt="Simusoft" style={{ height: 52, objectFit: 'contain' }} />
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Simusoft Technologies</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{cert.school}</div>
                </div>
              </div>
              {qrDataUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img src={qrDataUrl} alt="Verify QR" style={{ width: 72, height: 72, borderRadius: 8, border: `2px solid ${primary}20` }} />
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan to verify</div>
                </div>
              )}
            </div>

            {/* Certificate title */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '6px 24px', borderRadius: 50, background: `${primary}15`, border: `1.5px solid ${primary}30`, marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1rem' }}>🏅</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: primary, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Certificate of Completion</span>
                <span style={{ fontSize: '1rem' }}>🏅</span>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>This is to proudly certify that</div>
            </div>

            {/* Student name — the hero */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, color: '#0f172a', fontFamily: 'Georgia,serif', lineHeight: 1.1, letterSpacing: '-1px' }}>
                {cert.studentName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div style={{ flex: 1, maxWidth: 120, height: 2, background: `linear-gradient(to right,transparent,${primary})` }} />
                <span style={{ fontSize: '1.25rem' }}>⭐</span>
                <div style={{ flex: 1, maxWidth: 120, height: 2, background: `linear-gradient(to left,transparent,${primary})` }} />
              </div>
            </div>

            {/* Course info */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '0.75rem', fontWeight: 500 }}>has successfully completed the course</div>
              <div style={{ fontSize: 'clamp(1.3rem,3vw,1.75rem)', fontWeight: 800, color: primary, marginBottom: '0.5rem', lineHeight: 1.2 }}>{cert.courseName}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 20px', borderRadius: 50, background: '#dcfce7', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem' }}>🎯</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#15803d' }}>with a score of {cert.score}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,#e2e8f0,transparent)', margin: '0 2rem 2rem' }} />

            {/* Footer: signatures + cert ID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
              <div style={{ textAlign: 'center' }}>
                {cert.platformDirectorSignatureUrl && (
                  <img src={cert.platformDirectorSignatureUrl} alt="Director Signature" style={{ height: 40, objectFit: 'contain', marginBottom: 4, opacity: 0.85, display: 'block', margin: '0 auto 4px' }} />
                )}
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Georgia,serif', color: '#334155', marginBottom: 6 }}>{cert.platformDirectorName ?? 'SimuLearning'}</div>
                <div style={{ width: '80%', height: 1, background: '#cbd5e1', margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Director</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Certificate ID</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 800, color: '#475569', wordBreak: 'break-all' }}>{cert.certId}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 6, fontWeight: 600 }}>{cert.completedDate}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                {cert.principalSignatureUrl && (
                  <img src={cert.principalSignatureUrl} alt="Principal Signature" style={{ height: 40, objectFit: 'contain', marginBottom: 4, opacity: 0.85, display: 'block', margin: '0 auto 4px' }} />
                )}
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Georgia,serif', color: '#334155', marginBottom: 6 }}>{cert.principalName ?? cert.school}</div>
                <div style={{ width: '80%', height: 1, background: '#cbd5e1', margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>School Principal</div>
              </div>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div style={{ height: 8, background: `linear-gradient(to right, #06b6d4, #9333ea, ${primary})` }} />
        </div>

        {/* Verify link below */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            Verify this certificate at{' '}
            <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
              {typeof window !== 'undefined' ? window.location.origin : ''}/verify/{cert.certCode}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
