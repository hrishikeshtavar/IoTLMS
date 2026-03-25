'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/auth';

const RichTextEditor = dynamic(() => import('@/components/cms/RichTextEditor'), { ssr: false });

const LOCALES = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी',   flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी',    flag: '🇮🇳' },
] as const;

const STATUS_META: Record<string, { color: string; bg: string; emoji: string }> = {
  draft:     { color: '#b45309', bg: 'rgba(255,211,61,0.15)',  emoji: '📝' },
  in_review: { color: '#1A73E8', bg: 'rgba(26,115,232,0.12)', emoji: '🔍' },
  approved:  { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', emoji: '✅' },
  published: { color: '#00C896', bg: 'rgba(0,200,150,0.12)',  emoji: '🌐' },
};

const WORKFLOW_BUTTONS = [
  { label: '🔍 Submit for Review', status: 'in_review', color: '#1A73E8' },
  { label: '✅ Approve',           status: 'approved',  color: '#A855F7' },
  { label: '🌐 Publish',           status: 'published', color: '#00C896' },
  { label: '↩ Back to Draft',      status: 'draft',     color: '#718096' },
];

export default function LessonContentPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<'en' | 'hi' | 'mr'>('en');
  const [contents, setContents] = useState<Record<string, { id?: string; content_json: Record<string, unknown>; status: string }>>({
    en: { content_json: {}, status: 'draft' },
    hi: { content_json: {}, status: 'draft' },
    mr: { content_json: {}, status: 'draft' },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch(`/api/lesson-content/lesson/${lessonId}`)
      .then(r => r.json())
      .then((data: Array<{ locale: string; id: string; content_json: Record<string, unknown>; status: string }>) => {
        const map = { ...contents };
        data.forEach(c => { map[c.locale] = { id: c.id, content_json: c.content_json, status: c.status }; });
        setContents(map);
      }).catch(() => {});
  }, [lessonId]);

  const handleSave = async () => {
    setSaving(true);
    const cur = contents[activeLocale];
    await apiFetch('/api/lesson-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, locale: activeLocale, content_json: cur.content_json }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStatusChange = async (newStatus: string) => {
    const id = contents[activeLocale]?.id;
    if (!id) return;
    await apiFetch(`/api/lesson-content/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setContents(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], status: newStatus } }));
  };

  const curStatus = contents[activeLocale]?.status ?? 'draft';
  const statusMeta = STATUS_META[curStatus] ?? STATUS_META.draft;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Baloo 2'" }}>
            ← Back to Lessons
          </button>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>✏️ Content Editor</div>
        <button onClick={handleSave} disabled={saving}
          className="btn-primary"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : saved ? '✅ Saved!' : '💾 Save Draft'}
        </button>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {['✏️','📝','🌐','🔍','✅'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.6rem', opacity: 0.07, left: `${i * 22 + 4}%`, top: `${(i * 19) % 60 + 10}%`, animationDelay: `${i * 0.5}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Lesson Content Editor
          </h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.9rem' }}>
            Write and publish content in English, Hindi, and Marathi
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>

        {/* LOCALE TABS */}
        <div className="animate-fadeUp" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {LOCALES.map(loc => {
            const s = contents[loc.code]?.status ?? 'draft';
            const sm = STATUS_META[s] ?? STATUS_META.draft;
            const isActive = activeLocale === loc.code;
            return (
              <button key={loc.code} onClick={() => setActiveLocale(loc.code as 'en' | 'hi' | 'mr')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', borderRadius: '999px', border: '1.5px solid', borderColor: isActive ? 'var(--primary)' : 'var(--border)', background: isActive ? 'var(--primary)' : 'var(--card)', color: isActive ? '#fff' : 'var(--text2)', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', fontStyle: loc.code !== 'en' ? 'normal' : undefined }}>
                <span>{loc.flag}</span>
                <span style={{ fontFamily: loc.code !== 'en' ? 'Noto Sans Devanagari' : undefined }}>{loc.label}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, background: isActive ? 'rgba(255,255,255,0.2)' : sm.bg, color: isActive ? '#fff' : sm.color }}>
                  {sm.emoji} {s}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem', alignItems: 'start' }}>

          {/* EDITOR */}
          <div className="animate-fadeUp delay-100">
            <RichTextEditor
              locale={activeLocale}
              content={contents[activeLocale]?.content_json}
              onChange={json => setContents(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], content_json: json } }))}
            />
          </div>

          {/* SIDEBAR */}
          <div className="animate-fadeUp delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Status badge */}
            <div style={{ background: 'var(--card)', borderRadius: '1rem', border: '1.5px solid var(--border)', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Current Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.875rem', borderRadius: '0.75rem', background: statusMeta.bg, color: statusMeta.color, fontWeight: 700, fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{statusMeta.emoji}</span>
                <span style={{ textTransform: 'capitalize' }}>{curStatus.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Workflow actions */}
            <div style={{ background: 'var(--card)', borderRadius: '1rem', border: '1.5px solid var(--border)', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Approval Workflow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {WORKFLOW_BUTTONS.map(btn => (
                  <button key={btn.status} onClick={() => handleStatusChange(btn.status)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.75rem', border: '1.5px solid', borderColor: btn.color + '44', background: curStatus === btn.status ? btn.color : btn.color + '11', color: curStatus === btn.status ? '#fff' : btn.color, fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = btn.color; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { if (curStatus !== btn.status) { e.currentTarget.style.background = btn.color + '11'; e.currentTarget.style.color = btn.color; } }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{ background: 'rgba(26,115,232,0.06)', borderRadius: '1rem', border: '1.5px solid rgba(26,115,232,0.15)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem' }}>💡 Tips</div>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.6, paddingLeft: '1rem' }}>
                <li>Write EN first, then translate to HI & MR</li>
                <li>Use H2 for section headings</li>
                <li>Use code blocks for Arduino sketches</li>
                <li>Publish only after all 3 locales are approved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
