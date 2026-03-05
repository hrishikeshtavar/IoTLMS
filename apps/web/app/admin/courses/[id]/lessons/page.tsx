'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '../../../../lib/auth';

export default function CourseLessonsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/courses/${courseId}`).then(r => r.json()).then(setCourse);
    apiFetch(`/api/lessons/course/${courseId}`).then(r => r.json()).then(setLessons);
  }, [courseId]);

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    await apiFetch(`/api/lessons/${id}`, { method: 'DELETE' });
    setLessons(lessons.filter(l => l.id !== id));
  };

  const typeColor: Record<string, string> = { video: '#dbeafe', text: '#dcfce7', quiz: '#fef9c3', lab: '#fce7f3' };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{course?.title_en || 'Course'}</h1>
      </div>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Manage lessons for this course</p>
      <button onClick={() => router.push(`/admin/courses/${courseId}/lessons/new`)}
        style={{ marginBottom: 24, padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
        + Add Lesson
      </button>
      {lessons.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 12 }}>
          No lessons yet. Add your first lesson.
        </div>
      )}
      {lessons.map((lesson, i) => (
        <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 8, background: '#fff' }}>
          <span style={{ color: '#9ca3af', fontSize: 13, width: 24 }}>{i + 1}</span>
          <span style={{ flex: 1, fontWeight: 500 }}>{lesson.title}</span>
          <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: typeColor[lesson.type] || '#f3f4f6' }}>{lesson.type}</span>
          <button onClick={() => router.push(`/admin/courses/${courseId}/lessons/new?edit=${lesson.id}`)}
            style={{ padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Edit</button>
          <button onClick={() => deleteLesson(lesson.id)}
            style={{ padding: '4px 12px', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 6, cursor: 'pointer', fontSize: 13, background: 'none' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}
