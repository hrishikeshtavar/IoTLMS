'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

function renderContent(content: LessonContent['content_json'] | null) {
  if (!content || !content.content) return null;
  return content.content.map((node, i) => {
    if (node.type === 'paragraph') {
      return (
        <p key={i} style={{ marginBottom: '1.1rem', color: 'var(--text2)', lineHeight: 1.75, fontSize: '1rem' }}>
          {node.content?.map((c, j) => <span key={j}>{c.text}</span>)}
        </p>
      );
    }
    if (node.type === 'heading') {
      return (
        <h2 key={i} style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', marginTop: '1.75rem', fontFamily: "'Baloo 2'" }}>
          {node.content?.map(c => c.text).join('')}
        </h2>
      );
    }
    if (node.type === 'bulletList') {
      return (
        <ul key={i} style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          {node.content?.map((item, j) => (
            <li key={j} style={{ color: 'var(--text2)', marginBottom: '0.35rem', lineHeight: 1.65 }}>
              {(item as any).content?.map((c: any) => c.content?.map((t: any) => t.text).join('')).join('')}
            </li>
          ))}
        </ul>
      );
    }
    if (node.type === 'codeBlock') {
      return (
        <pre key={i} style={{ background: '#1A1A2E', color: '#00C896', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.25rem', overflowX: 'auto', fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: '0.875rem', lineHeight: 1.6 }}>
          {node.content?.map(c => c.text).join('')}
        </pre>
      );
    }
    return null;
  });
}

export default function CoursePage() {
  const { id } = useParams<{ id: string | string[] }>();
  const courseId = Array.isArray(id) ? id[0] : id;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    fetch(`http://localhost:3001/api/lessons/course/${courseId}`)
      .then(r => r.json())
      .then((data: Lesson[]) => {
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!activeLesson) return;
    setContentLoading(true);
    setLessonContent(null);
    fetch(`http://localhost:3001/api/lesson-content/lesson/${activeLesson.id}`)
      .then(r => r.json())
      .then((data: LessonContent[]) => {
        const en = data.find(c => c.locale === 'en') ?? data[0] ?? null;
        setLessonContent(en);
        setContentLoading(false);
      })
      .catch(() => setContentLoading(false));
  }, [activeLesson]);

  const completeLesson = async (lessonId: string) => {
    const newCompleted = new Set([...completed, lessonId]);
    setCompleted(newCompleted);
    const progressPct = Math.round((newCompleted.size / lessons.length) * 100);
    await fetch(`http://localhost:3001/api/enrollments/${courseId}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'student-1', progress_pct: progressPct }),
    }).catch(() => {});
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1] ?? null);
    }
  };

  const progress = lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.65rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <Link href="/courses" style={{ color: 'var(--text3)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
          ← Courses
        </Link>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: progress === 100 ? 'var(--accent)' : 'var(--text3)' }}>
            {progress === 100 ? '🏆 Complete!' : `${progress}% done`}
          </span>
        </div>
      </nav>

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

          {/* SIDEBAR */}
          <aside style={{ width: '280px', background: 'var(--card)', borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar header */}
            <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Lessons</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', width: `${progress}%`, transition: 'width 0.5s ease', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{completed.size}/{lessons.length}</span>
              </div>
            </div>

            {/* Lesson list */}
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

                  {/* Lesson header */}
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
                      <video src={activeLesson.content_url} controls style={{ width: '100%', height: '100%' }} onEnded={() => completeLesson(activeLesson.id)} />
                    </div>
                  )}

                  {/* VIDEO - no URL placeholder */}
                  {activeLesson.type === 'video' && !activeLesson.content_url && (
                    <div className="animate-popIn" style={{ marginBottom: '1.75rem', borderRadius: '1.25rem', background: '#1A1A2E', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: '3rem' }}>🎬</div>
                      <div style={{ color: '#aaa', fontSize: '0.9rem' }}>No video URL set yet</div>
                      <Link href={`/admin/courses/${courseId}/lessons/${activeLesson.id}/content`}
                        style={{ padding: '0.5rem 1.25rem', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700 }}>
                        Add via Content Editor →
                      </Link>
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
                        <div>{renderContent(lessonContent.content_json)}</div>
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
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #A855F7, #7c3aed)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(168,85,247,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                        🚀 Open Lab Simulator
                      </Link>
                    </div>
                  )}

                  {/* QUIZ */}
                  {activeLesson.type === 'quiz' && (
                    <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid rgba(255,107,53,0.2)', padding: '3rem', marginBottom: '1.75rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(255,107,53,0.08)' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="animate-float">📝</div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Knowledge Quiz</h3>
                      <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Test what you've learned in this lesson
                      </p>
                      <Link href={`/quiz/${activeLesson.id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, var(--primary), #ff8c5a)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(255,107,53,0.35)', transition: 'transform 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                        ▶ Start Quiz
                      </Link>
                    </div>
                  )}

                  {/* COMPLETE / NEXT ACTIONS */}
                  {activeLesson.type !== 'video' && (
                    <div className="animate-fadeUp delay-200" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
                      {!isDone ? (
                        <button onClick={() => completeLesson(activeLesson.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, var(--secondary), #1557cc)', color: '#fff', border: 'none', borderRadius: '999px', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,115,232,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
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
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, var(--primary), #ff8c5a)', color: '#fff', border: 'none', borderRadius: '999px', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,0.3)', transition: 'transform 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
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
