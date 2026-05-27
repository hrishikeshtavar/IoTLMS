'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/auth';

const RichTextEditor = dynamic(() => import('@/components/cms/RichTextEditor'), { ssr: false });

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी',  flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी',   flag: '🇮🇳' },
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

type Question = {
  id?: string;
  question_text: string;
  options: string[];
  correct_index: number;
  points: number;
};

type Assessment = {
  id: string;
  title: string;
  pass_score: number;
  questions: Question[];
};

function QuizBuilder({ lessonId }: { lessonId: string }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [title, setTitle] = useState('');
  const [passScore, setPassScore] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQ, setNewQ] = useState<Question>({ question_text: '', options: ['', '', '', ''], correct_index: 0, points: 10 });

  useEffect(() => {
    apiFetch(`/api/assessments/by-lesson/${lessonId}`)
      .then(r => r.json())
      .then((a: Assessment) => {
        if (a?.id) {
          setAssessment(a);
          setTitle(a.title || '');
          setPassScore(a.pass_score || 60);
          setQuestions(a.questions || []);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [lessonId]);

  const createAssessment = async () => {
    if (!title.trim()) return alert('Enter a quiz title first');
    setSaving(true);
    const r = await apiFetch('/api/assessments', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, title, pass_score: passScore, max_score: 100 }),
    });
    const a = await r.json();
    setAssessment(a);
    setSaved('Quiz created!');
    setTimeout(() => setSaved(''), 2000);
    setSaving(false);
  };

  const addQuestion = async () => {
    if (!assessment?.id) return alert('Create the quiz first');
    if (!newQ.question_text.trim()) return alert('Enter question text');
    if (newQ.options.some(o => !o.trim())) return alert('Fill all 4 options');
    setSaving(true);
    const r = await apiFetch('/api/assessments/questions', {
      method: 'POST',
      body: JSON.stringify({
        assessment_id: assessment.id,
        question_text: newQ.question_text,
        options_json: newQ.options,
        correct_answer: String(newQ.correct_index),
        points: newQ.points,
      }),
    });
    const q = await r.json();
    setQuestions(prev => [...prev, q]);
    setNewQ({ question_text: '', options: ['', '', '', ''], correct_index: 0, points: 10 });
    setSaved('Question added!');
    setTimeout(() => setSaved(''), 2000);
    setSaving(false);
  };

  const removeQuestion = async (idx: number) => {
    const q = questions[idx];
    if (!q?.id) { setQuestions(prev => prev.filter((_, i) => i !== idx)); return; }
    await apiFetch(`/api/assessments/questions/${q.id}`, { method: 'DELETE' }).catch(() => {});
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', background: 'var(--surface)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text3)', textAlign: 'center' }}>Loading quiz…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Quiz Header */}
      <div style={{ background: 'var(--card)', borderRadius: 16, border: '1.5px solid var(--border)', padding: '1.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>
          {assessment ? '✅ Quiz Created' : '📝 Create Quiz'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 12 }}>
          <input style={inp} placeholder="Quiz title e.g. IoT Basics Quiz" value={title}
            onChange={e => setTitle(e.target.value)} disabled={!!assessment} />
          <input style={{ ...inp, width: 80, textAlign: 'center' }} type="number" min={1} max={100}
            value={passScore} onChange={e => setPassScore(Number(e.target.value))} disabled={!!assessment}
            title="Pass score %" />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 12 }}>Pass score: {passScore}%</div>
        {!assessment && (
          <button onClick={createAssessment} disabled={saving} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            {saving ? 'Creating…' : '+ Create Quiz'}
          </button>
        )}
        {saved && <div style={{ color: '#00C896', fontWeight: 700, fontSize: '0.875rem', marginTop: 8 }}>✓ {saved}</div>}
      </div>

      {/* Existing Questions */}
      {questions.length > 0 && (
        <div style={{ background: 'var(--card)', borderRadius: 16, border: '1.5px solid var(--border)', padding: '1.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>
            Questions ({questions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {questions.map((q, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)', position: 'relative' }}>
                <button onClick={() => removeQuestion(i)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '1rem' }}>✕</button>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Q{i + 1}. {q.question_text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: 6, background: oi === q.correct_index ? 'var(--secondary-light)' : 'transparent', color: oi === q.correct_index ? 'var(--secondary-dark)' : 'var(--text2)', border: `1px solid ${oi === q.correct_index ? 'var(--secondary)' : 'var(--border)'}`, fontWeight: oi === q.correct_index ? 700 : 400 }}>
                      {String.fromCharCode(65 + oi)}. {opt} {oi === q.correct_index ? '✓' : ''}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 6 }}>{q.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Question */}
      {assessment && (
        <div style={{ background: 'var(--card)', borderRadius: 16, border: '1.5px solid var(--border)', padding: '1.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>➕ Add Question</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea style={{ ...inp, minHeight: 72, resize: 'vertical' }} placeholder="Question text"
              value={newQ.question_text} onChange={e => setNewQ(p => ({ ...p, question_text: e.target.value }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {newQ.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="radio" name="correct" checked={newQ.correct_index === i}
                    onChange={() => setNewQ(p => ({ ...p, correct_index: i }))}
                    style={{ accentColor: 'var(--secondary)', flexShrink: 0 }} title="Mark as correct" />
                  <input style={inp} placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt}
                    onChange={e => { const o = [...newQ.options]; o[i] = e.target.value; setNewQ(p => ({ ...p, options: o })); }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>Points:</div>
              <input style={{ ...inp, width: 70 }} type="number" min={1} value={newQ.points}
                onChange={e => setNewQ(p => ({ ...p, points: Number(e.target.value) }))} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Select correct answer with radio button</div>
            </div>
            <button onClick={addQuestion} disabled={saving}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
              {saving ? 'Adding…' : '+ Add Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonContentPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<'en' | 'hi' | 'mr'>('en');
  const [lessonType, setLessonType] = useState<string>('text');
  const [contents, setContents] = useState<Record<string, { id?: string; content_json: Record<string, unknown>; status: string }>>({
    en: { content_json: {}, status: 'draft' },
    hi: { content_json: {}, status: 'draft' },
    mr: { content_json: {}, status: 'draft' },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Fetch lesson to know its type
    apiFetch(`/api/lessons/${lessonId}`)
      .then(r => r.json())
      .then((l: { type?: string }) => { if (l?.type) setLessonType(l.type); })
      .catch(() => {});

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
  const isQuiz = lessonType === 'quiz';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--card)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            ← Back to Lessons
          </button>
          {isQuiz && <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>📝 Quiz Lesson</span>}
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
          {isQuiz ? '📝 Quiz Builder' : '✏️ Content Editor'}
        </div>
        {!isQuiz && (
          <button onClick={handleSave} disabled={saving} className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : saved ? '✅ Saved!' : '💾 Save Draft'}
          </button>
        )}
        {isQuiz && <div style={{ width: 120 }} />}
      </nav>

      {/* HEADER */}
      <div style={{ background: isQuiz ? 'linear-gradient(135deg, #1E293B, #1a1a3e)' : 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="animate-fadeUp" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            {isQuiz ? 'Quiz Builder' : 'Lesson Content Editor'}
          </h1>
          <p className="animate-fadeUp delay-100" style={{ color: '#aaa', fontSize: '0.9rem' }}>
            {isQuiz ? 'Create MCQ questions, set pass score, and publish the quiz' : 'Write and publish content in English, Hindi, and Marathi'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>

        {/* QUIZ MODE */}
        {isQuiz ? (
          <QuizBuilder lessonId={lessonId} />
        ) : (
          <>
            {/* LOCALE TABS */}
            <div className="animate-fadeUp" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {LOCALES.map(loc => {
                const s = contents[loc.code]?.status ?? 'draft';
                const sm = STATUS_META[s] ?? STATUS_META.draft;
                const isActive = activeLocale === loc.code;
                return (
                  <button key={loc.code} onClick={() => setActiveLocale(loc.code as 'en' | 'hi' | 'mr')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', borderRadius: '999px', border: '1.5px solid', borderColor: isActive ? 'var(--primary)' : 'var(--border)', background: isActive ? 'var(--primary)' : 'var(--card)', color: isActive ? '#fff' : 'var(--text2)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
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
                <div style={{ background: 'var(--card)', borderRadius: '1rem', border: '1.5px solid var(--border)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Current Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.875rem', borderRadius: '0.75rem', background: statusMeta.bg, color: statusMeta.color, fontWeight: 700, fontSize: '0.9rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{statusMeta.emoji}</span>
                    <span style={{ textTransform: 'capitalize' }}>{curStatus.replace('_', ' ')}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--card)', borderRadius: '1rem', border: '1.5px solid var(--border)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Approval Workflow</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {WORKFLOW_BUTTONS.map(btn => (
                      <button key={btn.status} onClick={() => handleStatusChange(btn.status)}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.75rem', border: '1.5px solid', borderColor: btn.color + '44', background: curStatus === btn.status ? btn.color : btn.color + '11', color: curStatus === btn.status ? '#fff' : btn.color, fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
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
          </>
        )}
      </div>
    </div>
  );
}
