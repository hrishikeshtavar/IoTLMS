'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getUser, logout } from '../../lib/auth';

type AssessmentStat = {
  id: string; title: string; lessonTitle: string; courseTitle: string; courseId: string;
  questionCount: number; passScore: number; maxScore: number;
  totalSubmissions: number; passedCount: number; passRate: number; avgScore: number;
  lastSubmission: string | null;
};

export default function AssessmentsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AssessmentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    if (!u || (u.role !== 'admin' && u.role !== 'super_admin')) { router.push('/login'); return; }
    setAdminUser(u);
    apiFetch('/api/assessments/tenant/stats')
      .then(r => r.json())
      .then(d => { setStats(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const overall = stats.length > 0
    ? Math.round(stats.reduce((s, a) => s + a.passRate, 0) / stats.length)
    : 0;
  const totalSubmissions = stats.reduce((s, a) => s + a.totalSubmissions, 0);
  const flagged = stats.filter(a => a.totalSubmissions > 0 && a.passRate < 50);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Nunito', sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: '#0F172A', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>← Back</button>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>📝 Review Assessments</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{adminUser?.name}</span>
          <button onClick={() => { logout(); router.push('/login'); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Quizzes', value: stats.length, emoji: '📝', color: '#1A73E8' },
            { label: 'Total Submissions', value: totalSubmissions, emoji: '📊', color: '#7C3AED' },
            { label: 'Overall Pass Rate', value: `${overall}%`, emoji: '🎯', color: overall >= 70 ? '#16A34A' : overall >= 50 ? '#D97706' : '#DC2626' },
            { label: 'Needs Attention', value: flagged.length, emoji: '⚠️', color: '#DC2626' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Flagged section */}
        {flagged.length > 0 && (
          <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 14, padding: '1.25rem', marginBottom: 24 }}>
            <div style={{ fontWeight: 800, color: '#DC2626', marginBottom: 10 }}>⚠️ Low Pass Rate — Consider Reducing Difficulty</div>
            {flagged.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #FEE2E2' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>{a.title || a.lessonTitle}</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.75rem', marginLeft: 8 }}>{a.courseTitle}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#DC2626', fontSize: '0.9rem' }}>{a.passRate}% pass rate</span>
                  <button onClick={() => router.push(`/admin/courses/${a.courseId}`)}
                    style={{ padding: '4px 12px', borderRadius: 6, background: '#FEE2E2', color: '#DC2626', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    Edit Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All assessments table */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', fontWeight: 800, color: '#0F172A' }}>All Quizzes & Assessments</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>Loading…</div>
          ) : stats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No assessments found. Create quizzes in the course editor.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Quiz', 'Course', 'Questions', 'Submissions', 'Pass Rate', 'Avg Score', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #E2E8F0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.map(a => {
                    const status = a.totalSubmissions === 0 ? 'no-data' : a.passRate >= 70 ? 'good' : a.passRate >= 50 ? 'warning' : 'poor';
                    const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
                      'no-data': { bg: '#F1F5F9', color: '#64748B', label: 'No Data' },
                      'good':    { bg: '#DCFCE7', color: '#16A34A', label: '✅ Good' },
                      'warning': { bg: '#FEF9C3', color: '#B45309', label: '⚠️ Review' },
                      'poor':    { bg: '#FEE2E2', color: '#DC2626', label: '❌ Hard' },
                    };
                    const s = statusStyle[status];
                    return (
                      <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{a.title || a.lessonTitle || '—'}<br/><span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{a.lessonTitle}</span></td>
                        <td style={{ padding: '12px 14px', color: '#334155' }}>{a.courseTitle || '—'}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{a.questionCount}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{a.totalSubmissions}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: status === 'good' ? '#16A34A' : status === 'poor' ? '#DC2626' : '#B45309' }}>{a.totalSubmissions > 0 ? `${a.passRate}%` : '—'}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{a.totalSubmissions > 0 ? `${a.avgScore}%` : '—'}</td>
                        <td style={{ padding: '12px 14px' }}><span style={{ padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, fontWeight: 700, fontSize: '0.75rem' }}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
