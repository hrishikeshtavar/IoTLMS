'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser } from '../../lib/auth';

type Locale = 'en' | 'hi' | 'mr';

type Lesson = {
  id: string;
  title: string;
  type: 'lab' | 'quiz' | 'lesson' | 'video' | 'text' | string;
  content_url?: string;
};

type LessonContent = {
  id: string;
  locale?: string;
  content_json: { type: string; content: { type: string; text?: string; content?: { type: string; text: string }[] }[] };
  status: string;
};

const TYPE_META: Record<string, { emoji: string; color: string; label: string }> = {
  video:  { emoji: '🎬', color: '#1A73E8', label: 'Video' },
  text:   { emoji: '📖', color: '#00C896', label: 'Reading' },
  lesson: { emoji: '📖', color: '#00C896', label: 'Lesson' },
  lab:    { emoji: '🔬', color: '#A855F7', label: 'Lab' },
  quiz:   { emoji: '📝', color: '#FF6B35', label: 'Quiz' },
};


function toEmbedUrl(url: string): string {
  if (url.includes('youtu.be/')) return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
  if (url.includes('youtube.com/watch')) return 'https://www.youtube.com/embed/' + new URLSearchParams(url.split('?')[1]).get('v');
  return url;
}

function renderTipTap(nodes: any[]): React.ReactNode {
  return nodes.map((node: any, i: number) => {
    if (node.type === 'paragraph') return <p key={i} style={{ margin: '0.5rem 0', lineHeight: 1.7 }}>{node.content?.map((c: any, j: number) => <span key={j}>{c.text}</span>)}</p>;
    if (node.type === 'heading') return <h3 key={i} style={{ margin: '1rem 0 0.5rem', fontWeight: 700 }}>{node.content?.map((c: any) => c.text).join('')}</h3>;
    if (node.type === 'bulletList') return <ul key={i} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>{node.content?.map((item: any, j: number) => <li key={j} style={{ marginBottom: 4 }}>{item.content?.map((c: any) => c.content?.map((t: any) => t.text).join('')).join('')}</li>)}</ul>;
    if (node.type === 'orderedList') return <ol key={i} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>{node.content?.map((item: any, j: number) => <li key={j} style={{ marginBottom: 4 }}>{item.content?.map((c: any) => c.content?.map((t: any) => t.text).join('')).join('')}</li>)}</ol>;
    if (node.type === 'codeBlock') return <pre key={i} style={{ background: '#1e293b', color: '#00C896', padding: '1rem', borderRadius: 8, overflowX: 'auto', fontSize: '0.82rem', margin: '0.75rem 0' }}>{node.content?.map((c: any) => c.text).join('')}</pre>;
    if (node.type === 'blockquote') return <blockquote key={i} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1rem', color: 'var(--text3)', fontStyle: 'italic', margin: '0.75rem 0' }}>{node.content?.map((c: any, j: number) => <span key={j}>{c.content?.map((t: any) => t.text).join('')}</span>)}</blockquote>;
    if (node.type === 'hardBreak') return <br key={i} />;
    return null;
  });
}

function renderContent(content: LessonContent['content_json'] | null, quizHref?: string) {
  if (!content) return null;

  // blocks_v1 format (super-admin course editor)
  if ((content as any).format === 'blocks_v1') {
    const blocks: any[] = (content as any).blocks || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {blocks.map((block: any, i: number) => {
          if (block.type === 'text') {
            const json = block.content_en;
            if (!json || !json.content) return null;
            return <div key={i}>{renderTipTap(json.content)}</div>;
          }
          if (block.type === 'video') {
            const url = block.url;
            if (!url) return null;
            const isYT = url.includes('youtube.com') || url.includes('youtu.be');
            return (
              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                {isYT
                  ? <iframe src={toEmbedUrl(url)} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  : <video src={url} controls style={{ width: '100%', height: '100%' }} />}
              </div>
            );
          }
          if (block.type === 'image' && block.url) {
            return (
              <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={block.url} alt={block.caption || 'Image'} style={{ width: '100%', maxHeight: 480, objectFit: 'contain', display: 'block', background: '#f8fafc' }} />
                {block.caption && <div style={{ padding: '0.5rem 0.875rem', fontSize: '0.82rem', color: 'var(--text3)', fontStyle: 'italic', borderTop: '1px solid var(--border)' }}>{block.caption}</div>}
              </div>
            );
          }
          if (block.type === 'lab' && block.wokwi_url) {
            return (
              <div key={i} style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid rgba(168,85,247,0.2)', padding: '2.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(168,85,247,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔬</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Hands-on Lab</h3>
                {block.instructions && <p style={{ color: 'var(--text3)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{block.instructions}</p>}
                <a href={block.wokwi_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg,#A855F7,#7c3aed)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(168,85,247,0.35)' }}>
                  🚀 Open Wokwi Simulator
                </a>
              </div>
            );
          }
          if (block.type === 'quiz' && quizHref) {
            return (
              <div key={i} style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid rgba(255,107,53,0.2)', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(255,107,53,0.08)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Knowledge Quiz</h3>
                <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Test what you've learned in this lesson</p>
                <a href={quizHref} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, var(--primary), #ff8c5a)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(255,107,53,0.35)', textDecoration: 'none' }}>▶ Start Quiz</a>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Legacy TipTap format
  if (!content.content) return null;
  return <div>{renderTipTap(content.content as any[])}</div>;
}



export default function CoursePage() {
  const { id } = useParams<{ id: string | string[] }>();
  const courseId = Array.isArray(id) ? id[0] : id;

  const [locale, setLocale]             = useState<Locale>('en');
  const [lessons, setLessons]           = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set<string>());
  const [serverProgress, setServerProgress] = useState(0);
  const [assessmentMap, setAssessmentMap] = useState<Record<string, string>>({}); 
  const [loading, setLoading]           = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [notesOpen, setNotesOpen]       = useState(false);
  const [noteText, setNoteText]         = useState('');
  const [noteSaved, setNoteSaved]       = useState(false);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load locale preference
  useEffect(() => {
    const saved = localStorage.getItem('simulearning_locale') as Locale;
    if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved);
    const handler = (e: CustomEvent) => setLocale(e.detail as Locale);
    window.addEventListener('simu:locale-changed', handler as EventListener);
    return () => window.removeEventListener('simu:locale-changed', handler as EventListener);
  }, []);

  // Load lessons
  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    apiFetch(`/api/lessons/course/${courseId}`)
      .then(r => r.json())
      .then(async (data: Lesson[]) => {
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0] ?? null);
        setLoading(false);
        const map: Record<string, string> = {};
        await Promise.all(data.map(async (l) => {
          try { const r = await apiFetch('/api/assessments/by-lesson/' + l.id); const a = await r.json(); if (a && a.id) map[l.id] = a.id; } catch {}
        }));
        setAssessmentMap(map);
        // Load completed lessons from server
        const user = getUser();
        if (user?.id) {
          try {
            const compRes = await apiFetch(`/api/lessons/course/${courseId}/completed`);
            if (compRes.ok) {
              const compData = await compRes.json();
              setCompleted(new Set(compData.completed || []));
            }
          } catch {}
        }
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  // Load lesson content — locale-aware
  useEffect(() => {
    if (!activeLesson) return;
    setContentLoading(true);
    setLessonContent(null);
    const saved = localStorage.getItem(`simulearning_note_${activeLesson.id}`) ?? '';
    setNoteText(saved);
    setNoteSaved(false);

    apiFetch(`/api/lesson-content/lesson/${activeLesson.id}`)
      .then(r => r.json())
      .then((data: LessonContent[]) => {
        // Prefer current locale, then 'en', then first available
        const localeContent = data.find(c => c.locale === locale)
          ?? data.find(c => c.locale === 'en')
          ?? data[0]
          ?? null;
        setLessonContent(localeContent);
        setContentLoading(false);
      })
      .catch(() => setContentLoading(false));
  }, [activeLesson, locale]);

  const handleNoteChange = useCallback((val: string) => {
    setNoteText(val);
    setNoteSaved(false);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      if (activeLesson) {
        localStorage.setItem(`simulearning_note_${activeLesson.id}`, val);
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
      }
    }, 800);
  }, [activeLesson]);

  const completeLesson = async (lessonId: string) => {
    // Optimistic UI update
    setCompleted(prev => new Set([...prev, lessonId]));

    try {
      const res = await apiFetch(`/api/lessons/${lessonId}/complete`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        // Sync with server's authoritative progress
        if (data.completed_lessons !== undefined) {
          const compRes = await apiFetch(`/api/lessons/course/${courseId}/completed`);
          if (compRes.ok) {
            const compData = await compRes.json();
            setCompleted(new Set(compData.completed || []));
          }
        }
        // Auto-advance to next lesson
        const currentIndex = lessons.findIndex(l => l.id === lessonId);
        if (currentIndex < lessons.length - 1) {
          setTimeout(() => setActiveLesson(lessons[currentIndex + 1] ?? null), 600);
        }
      }
    } catch {
      // Keep optimistic update on error
    }
  };

  const progress = lessons.length > 0 ? Math.min(Math.round((completed.size / lessons.length) * 100), 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <div style={{ position: 'sticky', top: 64, zIndex: 40, background: 'rgba(255,248,240,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <Link href="/courses" style={{ color: 'var(--text3)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
          ← Courses
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: progress === 100 ? 'var(--accent)' : 'var(--text3)' }}>
            {progress === 100 ? '🏆 Complete!' : `${progress}% done`}
          </span>
          <button onClick={() => { setNotesOpen(o => !o); setTimeout(() => textareaRef.current?.focus(), 150); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', borderRadius: '999px', border: '1.5px solid', borderColor: notesOpen ? 'var(--primary)' : 'var(--border)', background: notesOpen ? 'rgba(255,107,53,0.08)' : 'transparent', color: notesOpen ? 'var(--primary)' : 'var(--text3)', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            📝 {notesOpen ? 'Close Notes' : 'Notes'}
            {noteText.trim() && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ height: '4px', background: 'var(--border)', position: 'sticky', top: '53px', zIndex: 40 }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg, var(--primary), var(--accent))`, width: `${progress}%`, transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)', borderRadius: '0 2px 2px 0' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text3)' }}>
          <div className="animate-spin" style={{ fontSize: '3rem', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
          <div>Loading lessons...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', height: 'calc(100vh - 57px)', overflow: 'hidden' }}>

          {/* NOTES SLIDE-IN PANEL */}
          <style>{`
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            .notes-panel { animation: slideInRight 0.25s cubic-bezier(0.34,1.56,0.64,1); }
          `}</style>
          {notesOpen && (
            <div className="notes-panel" style={{ position: 'fixed', top: '57px', right: 0, width: 'min(360px, 90vw)', height: 'calc(100vh - 57px)', background: 'var(--card)', borderLeft: '1.5px solid var(--border)', zIndex: 40, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', flexShrink: 0 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📝 My Notes</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.15rem', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeLesson?.title ?? 'No lesson selected'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {noteSaved && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)' }}>✅ Saved</span>}
                  <button onClick={() => setNotesOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text3)', lineHeight: 1 }}>✕</button>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', gap: '0.75rem', overflow: 'hidden' }}>
                <textarea ref={textareaRef} value={noteText} onChange={e => handleNoteChange(e.target.value)}
                  placeholder={`Jot down notes for "${activeLesson?.title ?? 'this lesson'}"...\n\nTip: Use # for headings, - for bullet points`}
                  style={{ flex: 1, resize: 'none', border: '1.5px solid var(--border)', borderRadius: '0.875rem', padding: '0.875rem 1rem', fontFamily: "'Baloo 2', sans-serif", fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text2)', background: 'var(--bg)', outline: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
                    {noteText.trim() ? `${noteText.trim().split(/\s+/).length} words` : 'Start typing…'}
                  </span>
                  <button onClick={() => { if (activeLesson) { localStorage.setItem(`simulearning_note_${activeLesson.id}`, noteText); setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000); } }}
                    style={{ padding: '0.35rem 0.875rem', borderRadius: '999px', border: '1.5px solid var(--primary)', background: 'var(--primary)', color: '#fff', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                    💾 Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIDEBAR */}
          <aside style={{ width: '280px', background: 'var(--card)', borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Lessons</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', width: `${progress}%`, transition: 'width 0.5s ease', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{completed.size}/{lessons.length}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {lessons.map((lesson, i) => {
                const meta = TYPE_META[lesson.type] ?? { emoji: '📄', color: '#718096', label: lesson.type };
                const isDone = completed.has(lesson.id);
                const isActive = activeLesson?.id === lesson.id;
                return (
                  <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                    style={{ width: '100%', textAlign: 'left', padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: isActive ? `${meta.color}11` : 'transparent', borderLeft: isActive ? `3px solid ${meta.color}` : '3px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, background: isDone ? 'var(--accent)' : isActive ? meta.color : 'var(--border)', color: isDone || isActive ? '#fff' : 'var(--text3)', transition: 'all 0.2s' }}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 600, color: isActive ? 'var(--text)' : 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</div>
                      <div style={{ fontSize: '0.7rem', color: meta.color, fontWeight: 700, marginTop: '0.1rem' }}>{meta.emoji} {meta.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1.5rem,4vw,3rem)' }}>
            {activeLesson ? (() => {
              const meta = TYPE_META[activeLesson.type] ?? { emoji: '📄', color: '#718096', label: activeLesson.type };
              const isDone = completed.has(activeLesson.id);
              return (
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                  <div className="animate-fadeUp" style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: meta.color + '22', color: meta.color }}>
                        {meta.emoji} {meta.label}
                      </span>
                      {isDone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(0,200,150,0.15)', color: 'var(--accent)' }}>
                          ✅ Completed
                        </span>
                      )}
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
                      {activeLesson.title}
                    </h1>
                  </div>

                  {/* VIDEO */}
                  {activeLesson.type === 'video' && activeLesson.content_url && (
                    <div className="animate-popIn" style={{ marginBottom: '1.75rem', borderRadius: '1.25rem', overflow: 'hidden', background: '#000', aspectRatio: '16/9', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                      {activeLesson.content_url.includes('youtube.com') || activeLesson.content_url.includes('youtu.be')
                        ? <iframe src={toEmbedUrl(activeLesson.content_url)} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        : <video src={activeLesson.content_url} controls style={{ width: '100%', height: '100%' }} onEnded={() => completeLesson(activeLesson.id)} />
                      }
                    </div>
                  )}
                  {activeLesson.type === 'video' && !activeLesson.content_url && (
                    <div className="animate-popIn" style={{ marginBottom: '1.75rem', borderRadius: '1.25rem', background: '#1A1A2E', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: '3rem' }}>🎬</div>
                      <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Video coming soon</div>
                    </div>
                  )}

                  {/* TEXT / LESSON */}
                  {(activeLesson.type === 'text' || activeLesson.type === 'lesson') && (
                    <div className="animate-fadeUp" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '2rem', marginBottom: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                      {contentLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
                          <div className="animate-spin" style={{ fontSize: '2rem', display: 'inline-block', marginBottom: '0.75rem' }}>⚙️</div>
                          <div>Loading content...</div>
                        </div>
                      ) : lessonContent ? (
                        <div>{renderContent(lessonContent.content_json, assessmentMap[activeLesson.id] ? `/quiz/${assessmentMap[activeLesson.id]}?courseId=${courseId}` : undefined)}</div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
                          <p style={{ color: 'var(--text3)', marginBottom: '1rem' }}>No content yet.</p>
                          <Link href={`/admin/courses/${courseId}/lessons/${activeLesson.id}/content`}
                            style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>
                            Add via Content Editor →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LAB */}
                  {activeLesson.type === 'lab' && (
                    <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid rgba(168,85,247,0.2)', padding: '3rem', marginBottom: '1.75rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(168,85,247,0.1)' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="animate-float">🔬</div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Hands-on Lab</h3>
                      <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Open the Arduino simulator with Monaco editor + Wokwi
                      </p>
                      <Link href={`/lab/${activeLesson.id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #A855F7, #7c3aed)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(168,85,247,0.35)' }}>
                        🚀 Open Lab Simulator
                      </Link>
                    </div>
                  )}

                  {/* QUIZ */}
                  {assessmentMap[activeLesson.id] && !((lessonContent?.content_json as any)?.blocks ?? []).some((b:any) => b.type === 'quiz') && (
                    <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid rgba(255,107,53,0.2)', padding: '3rem', marginBottom: '1.75rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(255,107,53,0.08)' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="animate-float">📝</div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Knowledge Quiz</h3>
                      <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Test what you've learned in this lesson
                      </p>
                      <Link href={`/quiz/${assessmentMap[activeLesson.id] ?? activeLesson.id}?courseId=${courseId}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, var(--primary), #ff8c5a)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(255,107,53,0.35)' }}>
                        ▶ Start Quiz
                      </Link>
                    </div>
                  )}

                  {/* COMPLETE / NEXT ACTIONS */}
                  {(
                    <div className="animate-fadeUp delay-200" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
                      {!isDone ? (
                        <button onClick={() => completeLesson(activeLesson.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, var(--secondary), #1557cc)', color: '#fff', border: 'none', borderRadius: '999px', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,115,232,0.3)' }}>
                          ✓ Mark as Complete
                        </button>
                      ) : (
                        <>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'rgba(0,200,150,0.12)', color: 'var(--accent)', borderRadius: '999px', fontWeight: 700, fontSize: '0.9rem', border: '1.5px solid rgba(0,200,150,0.25)' }}>
                            ✅ Lesson Complete!
                          </div>
                          {lessons.findIndex(l => l.id === activeLesson.id) < lessons.length - 1 && (
                            <button onClick={() => {
                              const next = lessons[lessons.findIndex(l => l.id === activeLesson.id) + 1];
                              if (next) setActiveLesson(next);
                            }}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, var(--primary), #ff8c5a)', color: '#fff', border: 'none', borderRadius: '999px', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}>
                              Next Lesson →
                            </button>
                          )}
                          {progress === 100 && (
                            <Link href={`/certificate/${courseId}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #FFD93D, #f59e0b)', color: '#1A1A2E', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(255,211,61,0.4)' }}>
                              🏆 Get Certificate
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text3)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <div>No lessons yet.</div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
