'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser, logout } from '../../app/lib/auth';

const STREAM_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'Artificial Intelligence': { bg: '#EFF6FF', text: '#1D4ED8', bar: '#1A73E8' },
  'ESP32':                   { bg: '#FFF7ED', text: '#C2410C', bar: '#1A73E8' },
  'Arduino':                 { bg: '#F0FDF4', text: '#15803D', bar: '#00C896' },
  'IoT':                     { bg: '#F5F3FF', text: '#6D28D9', bar: '#A855F7' },
  'General':                 { bg: '#F9FAFB', text: '#374151', bar: '#6B7280' },
};

function getColor(category: string) {
  return STREAM_COLORS[category] || STREAM_COLORS['General'];
}

export default function AdminPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [schoolName, setSchoolName] = useState<string>('');

  useEffect(() => {
    const u = getUser();
    setAdminUser(u);
    if (u?.tenantId) {
      apiFetch('/api/tenants/' + u.tenantId).then(r => r.json()).then((t: any) => {
        if (t?.name) setSchoolName(t.name);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    apiFetch('/api/courses').then(r => r.json()).then(setCourses).catch(() => {});
  }, []);

  const totalEnrollments = courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0);
  const totalLessons = courses.reduce((sum, c) => sum + (c._count?.lessons || 0), 0);
  const maxEnrollments = Math.max(...courses.map(c => c._count?.enrollments || 0), 1);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'DM Sans, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🚀</div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1A73E8', letterSpacing: '-0.3px' }}>SimuLearning</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={() => router.push('/admin/profile')}
            style={{ padding: '7px 16px', borderRadius: 8, background: '#EFF6FF', color: '#1A73E8', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            👤 My Profile
          </button>
          <button onClick={logout}
            style={{ padding: '7px 16px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0E7490 100%)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>

            {/* Admin info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#1A73E8,#00C896)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff', border: '3px solid rgba(255,255,255,0.3)' }}>
                {adminUser?.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4 }}>School Admin</div>
                <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }}>{adminUser?.name || 'Admin'}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginTop: 4 }}>🏫 {schoolName || 'Loading...'}</div>
              </div>
            </div>

            {/* Stats pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Courses', value: courses.length, icon: '📚', color: '#60A5FA' },
                { label: 'Enrollments', value: totalEnrollments, icon: '👨‍🎓', color: '#34D399' },
                { label: 'Total Lessons', value: totalLessons, icon: '📖', color: '#A78BFA' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '0.875rem 1.25rem', textAlign: 'center', minWidth: 110 }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0F172A' }}>All Courses</h2>
            <p style={{ color: '#64748B', marginTop: 4, fontSize: '0.85rem' }}>{courses.length} courses · {totalEnrollments} total enrollments</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => router.push('/admin/users')}
              style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
              👨‍🎓 Manage Students</button>
            <button onClick={() => router.push('/admin/analytics')}
              style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#0EA5E9,#1A73E8)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' }}>
              📊 Analytics
            </button>
          </div>
        </div>

        {/* Course grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {courses.map(course => {
            const enrollments = course._count?.enrollments || 0;
            const lessons = course._count?.lessons || 0;
            const fillPct = Math.round((enrollments / maxEnrollments) * 100);
            const c = getColor(course.category);

            return (
              <div key={course.id} style={{ background: '#fff', borderRadius: 18, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}>

                {/* Color accent bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${c.bar}, ${c.bar}88)` }} />

                <div style={{ padding: '1.25rem' }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <h3 style={{ fontWeight: 700, margin: 0, fontSize: 14, color: '#0F172A', lineHeight: 1.45, flex: 1 }}>{course.title_en}</h3>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: course.status === 'published' ? '#DCFCE7' : '#FEF9C3', color: course.status === 'published' ? '#15803D' : '#92400E', fontWeight: 800, flexShrink: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {course.status}
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 999, background: c.bg, color: c.text, fontWeight: 700 }}>{course.category}</span>
                    {course.target_grade && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 999, background: '#F1F5F9', color: '#475569', fontWeight: 600 }}>Grade {course.target_grade}</span>}
                    {course.stream && course.stream !== 'GENERAL' && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 999, background: '#F1F5F9', color: '#475569', fontWeight: 600 }}>{course.stream}</span>}
                  </div>

                  {/* Enrollment bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Enrollment</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.bar }}>{enrollments} students</span>
                    </div>
                    <div style={{ height: 7, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(fillPct, enrollments > 0 ? 8 : 0)}%`, background: `linear-gradient(90deg, ${c.bar}, ${c.bar}99)`, borderRadius: 999, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Enrolled', value: enrollments, icon: '👨‍🎓', bg: '#EFF6FF', color: '#1A73E8' },
                      { label: 'Active', value: enrollments, icon: '🟢', bg: '#F0FDF4', color: '#15803D' },
                      { label: 'Lessons', value: lessons, icon: '📖', bg: '#F5F3FF', color: '#7C3AED' },
                    ].map(s => (
                      <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '0.6rem 0.4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', marginBottom: 2 }}>{s.icon}</div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
