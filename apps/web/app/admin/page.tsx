'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/courses').then(r => r.json()).then(setCourses).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Admin Panel</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Manage courses, lessons and students</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}><button onClick={() => router.push('/admin/courses/new')}
          style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          + New Course
        </button>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Courses ({courses.length})</h2>
      {courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 12 }}>
          No courses yet. Create your first course.
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {courses.map(course => (
          <div key={course.id} style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontWeight: 600, margin: 0, fontSize: 15 }}>{course.title_en}</h3>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: course.status === 'published' ? '#dcfce7' : '#fef9c3', color: course.status === 'published' ? '#16a34a' : '#92400e', fontWeight: 600 }}>
                {course.status}
              </span>
            </div>
            {course.category && <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 12px' }}>{course.category}</p>}
            <button onClick={() => router.push(`/admin/courses/${course.id}/lessons`)}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              Manage Lessons →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
