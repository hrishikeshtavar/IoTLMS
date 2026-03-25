'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/auth';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['IoT', 'Electronics', 'Programming', 'AI/ML', 'Robotics', 'Networking', 'Other'];
const STREAMS = ['GENERAL', 'SCIENCE', 'COMMERCE', 'ARTS'];

export default function NewCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title_en: '',
    title_hi: '',
    title_mr: '',
    description_en: '',
    category: '',
    level: 'beginner',
    duration_hours: '',
    price: '0',
    thumbnail_url: '',
    target_grade: '',
    stream: 'GENERAL',
    playlist_url: '',
    tags: '',
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_en.trim()) { setError('Course title (English) is required'); return; }
    setError('');
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title_en: form.title_en.trim(),
        slug: slugify(form.title_en),
        level: form.level,
        price: Number(form.price) || 0,
        stream: form.stream,
        status: 'draft',
      };
      if (form.title_hi) payload.title_hi = form.title_hi;
      if (form.title_mr) payload.title_mr = form.title_mr;
      if (form.description_en) payload.description_en = form.description_en;
      if (form.category) payload.category = form.category;
      if (form.duration_hours) payload.duration_hours = Number(form.duration_hours);
      if (form.thumbnail_url) payload.thumbnail_url = form.thumbnail_url;
      if (form.target_grade) payload.target_grade = form.target_grade;
      if (form.playlist_url) payload.playlist_url = form.playlist_url;
      if (form.tags) payload.tags_json = form.tags.split(',').map(t => t.trim()).filter(Boolean);

      const res = await apiFetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Failed to create course');
        setSaving(false);
        return;
      }
      const course = await res.json();
      router.push(`/admin/courses/${course.id}/lessons`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>
      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <span style={{ color: 'var(--text3)' }}>›</span>
          <Link href="/admin" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Admin</Link>
          <span style={{ color: 'var(--text3)' }}>›</span>
          <Link href="/admin/courses" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Courses</Link>
          <span style={{ color: 'var(--text3)' }}>›</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>New Course</span>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1e1e3f 0%, #2d2d5e 100%)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Create New Course
          </h1>
          <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Fill in the details to publish a new course</p>
        </div>
      </div>

      {/* FORM */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.85rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* SECTION: Basic Info */}
          <div style={sectionStyle}>
            <h2 style={sectionTitle}>Basic Information</h2>
            <div style={gridTwo}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Course Title (English) <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="e.g. IoT with Arduino" required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">— Select —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={gridTwo}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Title (Hindi)</label>
                <input style={inputStyle} value={form.title_hi} onChange={e => set('title_hi', e.target.value)} placeholder="हिन्दी में शीर्षक" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Title (Marathi)</label>
                <input style={inputStyle} value={form.title_mr} onChange={e => set('title_mr', e.target.value)} placeholder="मराठीत शीर्षक" />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.description_en} onChange={e => set('description_en', e.target.value)} placeholder="What will students learn in this course?" />
            </div>
          </div>

          {/* SECTION: Course Details */}
          <div style={sectionStyle}>
            <h2 style={sectionTitle}>Course Details</h2>
            <div style={gridThree}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Level</label>
                <select style={inputStyle} value={form.level} onChange={e => set('level', e.target.value)}>
                  {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Duration (hours)</label>
                <input style={inputStyle} type="number" min="0" value={form.duration_hours} onChange={e => set('duration_hours', e.target.value)} placeholder="e.g. 10" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Price (₹)</label>
                <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 = free" />
              </div>
            </div>
            <div style={gridTwo}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Stream</label>
                <select style={inputStyle} value={form.stream} onChange={e => set('stream', e.target.value)}>
                  {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Target Grade</label>
                <input style={inputStyle} value={form.target_grade} onChange={e => set('target_grade', e.target.value)} placeholder="e.g. Grade 9-12, College" />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tags <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(comma-separated)</span></label>
              <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="arduino, iot, sensors, esp32" />
            </div>
          </div>

          {/* SECTION: Media */}
          <div style={sectionStyle}>
            <h2 style={sectionTitle}>Media &amp; Links</h2>
            <div style={gridTwo}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Thumbnail URL</label>
                <input style={inputStyle} value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} placeholder="https://..." />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>YouTube Playlist URL</label>
                <input style={inputStyle} value={form.playlist_url} onChange={e => set('playlist_url', e.target.value)} placeholder="https://youtube.com/playlist?list=..." />
              </div>
            </div>
            {form.thumbnail_url && (
              <img src={form.thumbnail_url} alt="thumbnail preview" style={{ height: 120, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link href="/admin/courses" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1.5px solid var(--border)', color: 'var(--text2)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
              {saving ? '⏳ Creating…' : '✅ Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: 'var(--card)',
  borderRadius: '1.25rem',
  border: '1.5px solid var(--border)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};
const sectionTitle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text)',
  marginBottom: '0.25rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid var(--border)',
};
const gridTwo: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const gridThree: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' };
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.4rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' };
const inputStyle: React.CSSProperties = {
  padding: '0.7rem 0.9rem',
  borderRadius: '0.7rem',
  border: '1.5px solid var(--border)',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  background: 'var(--bg)',
  color: 'var(--text)',
  outline: 'none',
};
