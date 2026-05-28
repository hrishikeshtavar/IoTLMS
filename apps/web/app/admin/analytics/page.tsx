'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, getUser, logout } from '../../../app/lib/auth';

type DashboardData = {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  completionRate: number;
  passRate: number;
  enrollmentTrend: { month: string; enrollments: number }[];
  coursePerformance: { title: string; enrolled: number; completed: number }[];
};

function StatCard({ icon, label, value, sub, color, bg }: any) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 900, color, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
    </div>
  );
}

function RingChart({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={10} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const adminUser = getUser();
  const [schoolName, setSchoolName] = useState<string>('');

  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/analytics/dashboard').then(r => r.json()),
      apiFetch('/api/enrollments/tenant/all').then(r => r.json()),
      adminUser?.tenantId ? apiFetch('/api/tenants/' + adminUser.tenantId).then(r => r.json()).then((t:any) => { if(t?.name) setSchoolName(t.name); }).catch(()=>{}) : null,
    ]).then(([d, e]) => {
      setData(d);
      setEnrollments(Array.isArray(e) ? e.filter((x:any) => x.course?.tenant_id) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⚙️</div>
      <div style={{ color: '#64748B', fontWeight: 600 }}>Loading analytics…</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!data) return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>Failed to load analytics.</div>;

  const maxEnrolled = Math.max(...data.coursePerformance.map(c => c.enrolled), 1);
  const maxTrend = Math.max(...data.enrollmentTrend.map(t => t.enrollments), 1);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🚀</div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1A73E8' }}>SimuLearning</span>
          </Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>← Admin Panel</button>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={() => router.push('/admin/profile')}
            style={{ padding: '7px 16px', borderRadius: 8, background: '#EFF6FF', color: '#1A73E8', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            👤 {adminUser?.name?.split(' ')[0]}
          </button>
          <button onClick={logout}
            style={{ padding: '7px 16px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F, #0E7490)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#94D2E8', padding: '3px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>🏫 {schoolName || adminUser?.name || 'My School'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>📊 School Analytics</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>Performance insights · Student progress · Course engagement</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard icon="👨‍🎓" label="Total Students" value={data.totalStudents} sub="Registered on platform" color="#1A73E8" bg="#EFF6FF" />
          <StatCard icon="📚" label="Total Courses" value={data.totalCourses} sub="Published & active" color="#7C3AED" bg="#F5F3FF" />
          <StatCard icon="📋" label="Enrollments" value={data.totalEnrollments} sub="Across all courses" color="#0EA5E9" bg="#F0F9FF" />
          <StatCard icon="✅" label="Completion Rate" value={`${data.completionRate}%`} sub="Students finishing courses" color="#15803D" bg="#F0FDF4" />
          <StatCard icon="🎯" label="Pass Rate" value={`${data.passRate}%`} sub="Quiz & assessment pass" color="#D97706" bg="#FFFBEB" />
        </div>

        {/* Row 2: Completion + Pass rings, Enrollment trend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>

          {/* Performance rings */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>🎯 Performance Overview</h3>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Completion Rate', pct: data.completionRate, color: '#00C896' },
                { label: 'Pass Rate', pct: data.passRate, color: '#1A73E8' },
                { label: 'Enrollment Fill', pct: Math.min(100, Math.round((data.totalEnrollments / (data.totalStudents * data.totalCourses)) * 100)), color: '#A855F7' },
              ].map(r => (
                <div key={r.label} style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <RingChart pct={r.pct} color={r.color} size={90} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: r.color }}>{r.pct}%</div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, marginTop: 6, textAlign: 'center', maxWidth: 80 }}>{r.label}</div>
                </div>
              ))}
            </div>

            {/* Alert insights */}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.completionRate < 50 && (
                <div style={{ background: '#FEF9C3', borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.78rem', color: '#854D0E', fontWeight: 600, display: 'flex', gap: 6 }}>
                  ⚠️ Completion rate below 50% — consider follow-up sessions
                </div>
              )}
              {data.passRate > 70 && (
                <div style={{ background: '#DCFCE7', borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.78rem', color: '#14532D', fontWeight: 600, display: 'flex', gap: 6 }}>
                  🌟 Great pass rate! Students are performing well on assessments
                </div>
              )}
              {data.totalEnrollments > data.totalStudents && (
                <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.78rem', color: '#1E40AF', fontWeight: 600, display: 'flex', gap: 6 }}>
                  📈 Students enrolled in multiple courses — high engagement
                </div>
              )}
            </div>
          </div>

          {/* Completions per course chart */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>✅ Course Completions</h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>Number of students who completed each course</p>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#BFDBFE' }} /> Enrolled
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#1A73E8' }} /> Completed
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 160, paddingBottom: 8, borderBottom: '2px solid #E2E8F0', overflowX: 'auto' }}>
              {data.coursePerformance.map((c, i) => {
                const maxVal = Math.max(...data.coursePerformance.map(x => x.enrolled), 1);
                const enrolledH = Math.max(8, Math.round((c.enrolled / maxVal) * 120));
                const completedH = Math.max(4, Math.round((c.completed / maxVal) * 120));
                const colors = ['#1A73E8','#00C896','#A855F7','#FF6B35','#D97706','#0EA5E9','#10B981','#8B5CF6'];
                const color = colors[i % colors.length];
                const rate = c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 64, flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: rate === 100 ? '#15803D' : '#D97706', background: rate === 100 ? '#DCFCE7' : '#FEF9C3', padding: '1px 6px', borderRadius: 999 }}>{rate}%</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120 }}>
                      <div title={`${c.enrolled} enrolled`} style={{ width: 20, height: enrolledH, background: `${color}44`, border: `1.5px solid ${color}88`, borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease', cursor: 'default', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>{c.enrolled}</span>
                      </div>
                      <div title={`${c.completed} completed`} style={{ width: 20, height: completedH, background: `linear-gradient(180deg, ${color}, ${color}99)`, borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease', boxShadow: `0 2px 8px ${color}44`, cursor: 'default', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color }}>{c.completed}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, textAlign: 'center', lineHeight: 1.2, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.title}>{c.title}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1rem', padding: '0.875rem', background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                ✅ Total completions: <strong style={{ color: '#0F172A' }}>{data.coursePerformance.reduce((s, c) => s + c.completed, 0)}</strong> ·
                Top course: <strong style={{ color: '#00C896' }}>{data.coursePerformance.length ? data.coursePerformance.reduce((a, b) => a.completed > b.completed ? a : b).title : "N/A"}</strong> with {Math.max(...data.coursePerformance.map(c => c.completed))} completions
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Course performance table */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>📚 Course Performance</h3>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{data.coursePerformance.length} courses</span>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 1fr 80px', gap: 12, padding: '0 0.5rem', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <div>Course</div>
              <div style={{ textAlign: 'center' }}>Enrolled</div>
              <div style={{ textAlign: 'center' }}>Completed</div>
              <div>Progress</div>
              <div style={{ textAlign: 'center' }}>Rate</div>
            </div>
            {data.coursePerformance.map((c, i) => {
              const rate = c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0;
              const rateColor = rate >= 70 ? '#15803D' : rate >= 40 ? '#D97706' : '#DC2626';
              const rateBg = rate >= 70 ? '#DCFCE7' : rate >= 40 ? '#FEF9C3' : '#FEE2E2';
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 1fr 80px', gap: 12, alignItems: 'center', padding: '0.75rem 0.5rem', borderRadius: 10, background: i % 2 === 0 ? '#F8FAFC' : '#fff' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{c.title}</div>
                  <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: '#1A73E8' }}>{c.enrolled}</div>
                  <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: '#00C896' }}>{c.completed}</div>
                  <div>
                    <ProgressBar value={c.completed} max={c.enrolled} color={rateColor} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: rateBg, color: rateColor }}>{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 4: Payment methods + Quick insights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 24 }}>

          {/* Key insights */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>💡 Key Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  icon: '🏆',
                  bg: '#FFF7ED',
                  color: '#C2410C',
                  text: `Top course: "${data.coursePerformance[0]?.title}" with ${data.coursePerformance[0]?.enrolled} enrollments`
                },
                {
                  icon: '📉',
                  bg: '#FEF2F2',
                  color: '#DC2626',
                  text: `${data.coursePerformance.filter(c => c.enrolled === 0).length} courses have zero enrollments — promote them`
                },
                {
                  icon: '🎓',
                  bg: '#F0FDF4',
                  color: '#15803D',
                  text: `${Math.round((data.totalEnrollments / data.totalStudents) * 10) / 10} avg courses per student — good engagement`
                },
                {
                  icon: '📊',
                  bg: '#EFF6FF',
                  color: '#1D4ED8',
                  text: `${data.completionRate}% completion — ${data.completionRate >= 60 ? 'above average, keep it up!' : 'below target, review course difficulty'}`
                },
              ].map((ins, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.6rem 0.875rem', background: ins.bg, borderRadius: 10 }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{ins.icon}</span>
                  <span style={{ fontSize: '0.78rem', color: ins.color, fontWeight: 600, lineHeight: 1.4 }}>{ins.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Performance Section */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>👨‍🎓 Student Performance</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 20 }}>

            {/* Progress distribution */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>📊 Progress Distribution</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>How far along are students in their courses</p>
              {(() => {
                const buckets = [
                  { label: 'Not Started (0%)', min: 0, max: 0, color: '#F43F5E', bg: '#FEF2F2' },
                  { label: 'Just Started (1–25%)', min: 1, max: 25, color: '#FB923C', bg: '#FFF7ED' },
                  { label: 'In Progress (26–75%)', min: 26, max: 75, color: '#1A73E8', bg: '#EFF6FF' },
                  { label: 'Almost Done (76–99%)', min: 76, max: 99, color: '#A855F7', bg: '#F5F3FF' },
                  { label: 'Completed (100%)', min: 100, max: 100, color: '#00C896', bg: '#F0FDF4' },
                ];
                const total = enrollments.length || 1;
                return buckets.map(b => {
                  const count = enrollments.filter(e => e.progress_pct >= b.min && e.progress_pct <= b.max).length;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={b.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{b.label}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: b.color }}>{count} students ({pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: b.color, borderRadius: 999, transition: 'width 0.8s' }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Top performers */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>🏆 Top Performers</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>Students with highest completions & avg progress</p>
              {(() => {
                const byStudent: Record<string, { userId: string; name: string; total: number; completed: number; avgProgress: number }> = {};
                enrollments.forEach(e => {
                  if (!byStudent[e.user_id]) byStudent[e.user_id] = { userId: e.user_id, name: e.user?.name || e.user_id.slice(0, 12), total: 0, completed: 0, avgProgress: 0 };
                  byStudent[e.user_id].total++;
                  if (e.completed_at) byStudent[e.user_id].completed++;
                  byStudent[e.user_id].avgProgress += e.progress_pct;
                });
                const ranked = Object.values(byStudent)
                  .map(s => ({ ...s, avgProgress: Math.round(s.avgProgress / s.total) }))
                  .sort((a, b) => b.completed - a.completed || b.avgProgress - a.avgProgress)
                  .slice(0, 6);
                const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'];
                return ranked.map((s, i) => (
                  <div key={s.userId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem', borderRadius: 10, background: i === 0 ? '#FFFBEB' : '#F8FAFC', marginBottom: 6, border: i === 0 ? '1px solid #FDE68A' : '1px solid transparent' }}>
                    <span style={{ fontSize: '1.1rem' }}>{medals[i]}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                        {s.name || s.userId.slice(0, 12)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{s.total} courses · {s.completed} completed</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#00C896' }}>{s.avgProgress}%</div>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>avg progress</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

            {/* At-risk students */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>⚠️ At-Risk Students</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>Enrolled but making little or no progress</p>
              {(() => {
                const atRisk = enrollments
                  .filter(e => e.progress_pct <= 25 && !e.completed_at)
                  .reduce((acc: Record<string, any>, e) => {
                    if (!acc[e.user_id]) acc[e.user_id] = { userId: e.user_id, name: e.user?.name || e.user_id.slice(0, 12), courses: [] };
                    acc[e.user_id].courses.push({ title: e.course?.title_en, progress: e.progress_pct });
                    return acc;
                  }, {});
                const list = Object.values(atRisk).slice(0, 5);
                if (list.length === 0) return <div style={{ textAlign: 'center', padding: '1.5rem', color: '#00C896', fontWeight: 700, fontSize: '0.875rem' }}>✅ No at-risk students!</div>;
                return list.map((s: any, i) => (
                  <div key={s.userId} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.7rem 0.875rem', borderRadius: 10, background: '#FEF9F9', border: '1px solid #FECACA', marginBottom: 8 }}>
                    <span style={{ fontSize: '1.1rem' }}>🔴</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                        {s.name || s.userId.slice(0, 14)}
                      </div>
                      {s.courses.map((c: any, j: number) => (
                        <div key={j} style={{ fontSize: '0.68rem', color: '#DC2626', marginTop: 2 }}>
                          {c.title?.slice(0, 28)} — {c.progress}%
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: '#FEE2E2', color: '#DC2626', fontWeight: 700 }}>Needs help</span>
                  </div>
                ));
              })()}
            </div>

            {/* Category engagement */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>📂 Engagement by Category</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>Which subject areas are most popular</p>
              {(() => {
                const cats: Record<string, { enrolled: number; completed: number; totalProgress: number }> = {};
                enrollments.forEach(e => {
                  const cat = e.course?.category || 'General';
                  if (!cats[cat]) cats[cat] = { enrolled: 0, completed: 0, totalProgress: 0 };
                  cats[cat].enrolled++;
                  if (e.completed_at) cats[cat].completed++;
                  cats[cat].totalProgress += e.progress_pct;
                });
                const colors = ['#1A73E8','#00C896','#A855F7','#FF6B35','#D97706'];
                const maxEnrolled = Math.max(...Object.values(cats).map(c => c.enrolled), 1);
                return Object.entries(cats)
                  .sort((a, b) => b[1].enrolled - a[1].enrolled)
                  .map(([cat, c], i) => {
                    const avgProg = Math.round(c.totalProgress / c.enrolled);
                    const compRate = Math.round((c.completed / c.enrolled) * 100);
                    const barPct = Math.round((c.enrolled / maxEnrolled) * 100);
                    const color = colors[i % colors.length];
                    return (
                      <div key={cat} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{cat}</span>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999, background: '#EFF6FF', color: '#1A73E8', fontWeight: 700 }}>{c.enrolled} enrolled</span>
                            <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999, background: '#F0FDF4', color: '#15803D', fontWeight: 700 }}>{compRate}% done</span>
                          </div>
                        </div>
                        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${barPct}%`, background: color, borderRadius: 999 }} />
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 3 }}>Avg progress: {avgProg}%</div>
                      </div>
                    );
                  });
              })()}
            </div>
          </div>
        </div>
    </div>
  );
}
