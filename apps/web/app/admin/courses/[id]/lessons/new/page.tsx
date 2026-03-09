'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { apiFetch } from '../../../../../lib/auth';

const LESSON_TYPES = ['video', 'text', 'quiz', 'lab'];
const LOCALES = [{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' }, { code: 'mr', label: 'मराठी' }];

export default function NewLessonPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const editId = searchParams.get('edit');
  const [form, setForm] = useState({ title: '', type: 'text', order_index: 1, content_url: '' });
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lessonId, setLessonId] = useState<string | null>(editId);

  const editor = useEditor({ immediatelyRender: false, extensions: [StarterKit, Image, Link], content: '<p>Start writing lesson content here...</p>' });

  useEffect(() => {
    if (editId && editor) {
      apiFetch(`/api/lessons/${editId}`).then(r => r.json()).then(l => {
        setForm({ title: l.title, type: l.type, order_index: l.order_index, content_url: l.content_url || '' });
      });
      apiFetch(`/api/lessons/${editId}/content?locale=${locale}`).then(r => r.json()).then(c => {
        if (c?.content_json) editor.commands.setContent(c.content_json);
      });
    }
  }, [editId, editor]);

  const saveLesson = async () => {
    setLoading(true);
    try {
      let id = lessonId;
      if (!id) {
        const res = await apiFetch('/api/lessons', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, course_id: courseId }),
        });
        const lesson = await res.json();
        id = lesson.id;
        setLessonId(id);
      } else {
        await apiFetch(`/api/lessons/${id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      if (editor && form.type === 'text') {
        await apiFetch(`/api/lessons/${id}/content`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale, content_json: editor.getJSON() }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer',
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151', fontWeight: 500, fontSize: 13,
  });

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.push(`/admin/courses/${courseId}/lessons`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{editId ? 'Edit Lesson' : 'New Lesson'}</h1>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Title</label>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Lesson title" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Type</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {LESSON_TYPES.map(t => <button key={t} onClick={() => setForm({ ...form, type: t })} style={btnStyle(form.type === t)}>{t}</button>)}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Order Index</label>
        <input type="number" value={form.order_index} onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) })}
          style={{ width: 100, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
      </div>
      {(form.type === 'video' || form.type === 'lab') && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
            {form.type === 'video' ? 'Video URL (MinIO)' : 'Wokwi Project URL'}
          </label>
          <input value={form.content_url} onChange={e => setForm({ ...form, content_url: e.target.value })}
            placeholder={form.type === 'video' ? 'https://...' : 'https://wokwi.com/projects/...'}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} />
        </div>
      )}
      {form.type === 'text' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontWeight: 600 }}>Content</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {LOCALES.map(l => <button key={l.code} onClick={() => setLocale(l.code)} style={btnStyle(locale === l.code)}>{l.label}</button>)}
            </div>
          </div>
          <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 4, padding: '8px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', flexWrap: 'wrap' }}>
              {[
                { label: 'B', cmd: () => editor?.chain().focus().toggleBold().run() },
                { label: 'I', cmd: () => editor?.chain().focus().toggleItalic().run() },
                { label: 'H2', cmd: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
                { label: 'H3', cmd: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
                { label: '• List', cmd: () => editor?.chain().focus().toggleBulletList().run() },
                { label: '1. List', cmd: () => editor?.chain().focus().toggleOrderedList().run() },
                { label: '{ }', cmd: () => editor?.chain().focus().toggleCode().run() },
              ].map(({ label, cmd }) => (
                <button key={label} onClick={cmd} style={{ padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: 12, background: '#fff' }}>{label}</button>
              ))}
            </div>
            <EditorContent editor={editor} style={{ minHeight: 300, padding: 16, fontSize: 15, lineHeight: 1.6 }} />
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={saveLesson} disabled={loading}
          style={{ padding: '11px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : saved ? '✅ Saved!' : 'Save Lesson'}
        </button>
        <button onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}
          style={{ padding: '11px 28px', border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 600, cursor: 'pointer', background: '#fff' }}>
          Back to Lessons
        </button>
      </div>
    </div>
  );
}
