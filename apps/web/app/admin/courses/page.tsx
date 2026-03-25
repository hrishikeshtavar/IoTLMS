'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/auth';

type Course = {
  id: string;
  title_en: string;
  category?: string;
  status: string;
  _count?: { lessons?: number; enrollments?: number };
};

const STATUS_META: Record<string, { color: string; bg: string }> = {
  draft:     { color: '#b45309', bg: 'rgba(255,211,61,0.15)' },
  published: { color: '#00C896', bg: 'rgba(0,200,150,0.12)' },
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/courses')
      .then(r => r.json())
      .then(data => { setCourses(Array.isArray(data) ? data : data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>← Admin Panel</Link>
        </div>
        <div style={{ fontWeight: 800, color: 'var(--text)' }}>📚 Courses</div>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {['📚','✏️','🎓','📋','⚡'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.8rem', opacity: 0.07, left: `${i * 22 + 4}%`, top: `${(i * 19) % 60 + 10}%`, animationDelay: `${i * 0.5}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Manage Courses</h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.95rem' }}>{courses.length} courses in your platform</p>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>
            <div className="animate-spin" style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
            <div>Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <div>No courses yet. Create one from the Admin Panel.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {courses.map((course, i) => {
              const sm = STATUS_META[course.status] ?? STATUS_META.draft;
              return (
                <div key={course.id} className={`card-hover animate-fadeUp delay-${Math.min((i % 5 + 1) * 100, 500)}`}
                  style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{course.title_en}</span>
                      <span style={{ padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, background: sm.bg, color: sm.color }}>
                        {course.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text3)' }}>
                      {course.category && <span>🏷 {course.category}</span>}
                      <span>📚 {course._count?.lessons ?? 0} lessons</span>
                      <span>👥 {course._count?.enrollments ?? 0} enrolled</span>
                    </div>
                  </div>
                  <Link href={`/admin/courses/${course.id}/lessons`}
                    className="btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    Manage Lessons →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
