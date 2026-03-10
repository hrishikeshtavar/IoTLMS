'use client';
import { apiFetch, getUser } from '../../lib/auth';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

type QuestionOption = { value: string; label: string; };
type Question = { id: string; question_text: string; options_json: QuestionOption[]; };
type Assessment = { questions: Question[]; pass_score: number; };
type QuestionResult = { is_correct: boolean; correct_answer: string; points_earned: number; };
type QuizResult = { passed: boolean; score: number; max_score: number; percentage: number; pass_score: number; results: QuestionResult[]; };

// ─── IndexedDB helpers ───────────────────────────────────────────────────────
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('iotlearn', 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('assessments')) db.createObjectStore('assessments', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('pending_submissions')) db.createObjectStore('pending_submissions', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function cacheAssessment(id: string, data: Assessment) {
  if (typeof window === 'undefined') return;
  const db = await openDB();
  db.transaction('assessments', 'readwrite').objectStore('assessments').put({ id, data, cachedAt: Date.now() });
}
async function getCachedAssessment(id: string): Promise<Assessment | null> {
  if (typeof window === 'undefined') return null;
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const req = db.transaction('assessments', 'readonly').objectStore('assessments').get(id);
      req.onsuccess = () => resolve(req.result?.data ?? null);
      req.onerror = () => resolve(null);
    });
  } catch { return null; }
}
async function cacheSubmission(submission: object) {
  if (typeof window === 'undefined') return;
  const db = await openDB();
  db.transaction('pending_submissions', 'readwrite').objectStore('pending_submissions').put({ ...submission, id: Date.now().toString() });
}

// ─── Confetti canvas ─────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF6B35','#1A73E8','#00C896','#FFD93D','#A855F7','#ff4d6d','#06d6a0'];

type Particle = {
  x: number; y: number; vx: number; vy: number;
  color: string; size: number; angle: number; spin: number;
  shape: 'rect' | 'circle' | 'star';
  alpha: number;
};

function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  const spawnBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const shapes: Particle['shape'][] = ['rect', 'circle', 'star'];
    for (let i = 0; i < 180; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 14 + 4;
      particles.current.push({
        x: cx + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.35,
        vx: Math.cos(angle) * speed * 0.9,
        vy: Math.sin(angle) * speed - 8,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 9 + 5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        alpha: 1,
      });
    }
  }, []);

  function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.lineTo(cx + (r / 2.5) * Math.cos(b), cy + (r / 2.5) * Math.sin(b));
    }
    ctx.closePath();
    ctx.fill();
  }

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particles.current = [];
    spawnBurst();
    // Second burst after 400ms
    const t2 = setTimeout(() => spawnBurst(), 400);
    // Third burst after 800ms
    const t3 = setTimeout(() => spawnBurst(), 800);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.alpha > 0.02);
      for (const p of particles.current) {
        p.x += p.vx;
        p.vy += 0.35; // gravity
        p.y += p.vy;
        p.vx *= 0.99;
        p.angle += p.spin;
        p.alpha -= 0.008;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, 0, 0, p.size / 2);
        }
        ctx.restore();
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', resize);
    };
  }, [active, spawnBurst]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
  );
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────
export default function QuizPage() {
  const { assessmentId } = useParams();
  const _rawId = Array.isArray(assessmentId) ? assessmentId[0] : assessmentId;
  const assessmentIdParam = _rawId?.startsWith("asmt-") ? _rawId : `asmt-${_rawId}`;
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!assessmentIdParam) return;
    apiFetch(`/api/assessments/${assessmentIdParam}`)
      .then(r => r.json())
      .then(async (data: Assessment) => {
        setAssessment(data); await cacheAssessment(assessmentIdParam, data); setLoading(false);
      })
      .catch(async () => {
        const cached = await getCachedAssessment(assessmentIdParam);
        if (cached) { setAssessment(cached); setIsOffline(true); }
        setLoading(false);
      });
  }, [assessmentIdParam]);

  const submitQuiz = async () => {
    setSubmitting(true);
    const currentUser = getUser();
    const payload = {
      user_id: currentUser?.id ?? "",
      assessment_id: assessmentIdParam,
      answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer })),
    };
    try {
      const { apiFetch } = await import('../../lib/auth');
      const res = await apiFetch('/api/assessments/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data: QuizResult = await res.json();
      setResult(data);
      if (data.passed) {
        setTimeout(() => setShowConfetti(true), 300);
        setTimeout(() => setRevealed(true), 500);
        setTimeout(() => setShowConfetti(false), 6000);
      } else {
        setRevealed(true);
      }
    } catch {
      await cacheSubmission(payload);
      setResult({ passed: false, score: 0, max_score: 100, percentage: 0, pass_score: 0, results: [] });
      setIsOffline(true);
      setRevealed(true);
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: "'Baloo 2'" }}>
      <div style={{ textAlign: 'center', color: 'var(--text3)' }}>
        <div className="animate-spin" style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
        <div>Loading quiz...</div>
      </div>
    </div>
  );

  if (!assessment) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: "'Baloo 2'" }}>
      <div style={{ textAlign: 'center', color: 'var(--text3)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <div>Quiz not found</div>
      </div>
    </div>
  );

  const questions = assessment.questions ?? [];
  const question = questions[currentQ];
  const allAnswered = questions.every(q => Boolean(answers[q.id]));
  const progressPct = ((currentQ + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>
      <ConfettiCanvas active={showConfetti} />

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Baloo 2'" }}>← Back</button>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>📝 IoTLearn Quiz</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isOffline && <span style={{ padding: '0.25rem 0.65rem', background: 'rgba(255,107,53,0.12)', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>📡 Offline</span>}
          {!result && <span style={{ fontSize: '0.82rem', color: 'var(--text3)', fontWeight: 600 }}>{Object.keys(answers).length}/{questions.length} answered</span>}
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) 1.5rem' }}>

        {/* ── RESULT SCREEN ── */}
        {result ? (
          <div className={`animate-${result.passed ? 'celebrate' : 'fadeUp'}`}
            style={{ background: 'var(--card)', borderRadius: '1.5rem', border: `2px solid ${result.passed ? 'rgba(0,200,150,0.3)' : 'rgba(255,107,53,0.2)'}`, overflow: 'hidden', boxShadow: result.passed ? '0 8px 40px rgba(0,200,150,0.15)' : '0 4px 20px rgba(0,0,0,0.08)', opacity: revealed ? 1 : 0, transition: 'opacity 0.5s ease' }}>

            {/* Result hero */}
            <div style={{ background: result.passed ? 'linear-gradient(135deg, #00C896, #00a87a)' : 'linear-gradient(135deg, #FF6B35, #e05520)', padding: '2.5rem', textAlign: 'center' }}>
              {isOffline ? (
                <>
                  <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>📡</div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Saved for Sync</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>Your answers will sync when you reconnect.</p>
                </>
              ) : (
                <>
                  <div className={result.passed ? 'animate-celebrate' : ''} style={{ fontSize: '4.5rem', marginBottom: '0.75rem', display: 'inline-block' }}>
                    {result.passed ? '🏆' : '😤'}
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                    {result.passed ? 'Quiz Passed! 🎉' : 'Not Quite!'}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
                    {result.passed ? 'Amazing work — you nailed it!' : `You need ${result.pass_score} points to pass. Keep going!`}
                  </p>
                </>
              )}
            </div>

            {/* Score ring + stats */}
            {!isOffline && (
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                {/* Big score circle */}
                <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border)" strokeWidth="10" />
                    <circle cx="70" cy="70" r="60" fill="none"
                      stroke={result.passed ? '#00C896' : '#FF6B35'} strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - (result?.percentage ?? result?.score ?? 0) / 100)}
                      strokeLinecap="round"
                      className="progress-ring-circle"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: result.passed ? '#00C896' : '#FF6B35', lineHeight: 1 }}>{result?.percentage ?? result?.score ?? 0}%</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>score</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { label: 'Your Score', value: result.score, color: result.passed ? '#00C896' : '#FF6B35' },
                    { label: 'Max Score', value: result.max_score, color: 'var(--secondary)' },
                    { label: 'Pass Score', value: result.pass_score, color: '#A855F7' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Per-question breakdown */}
                {result?.results?.length > 0 && (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result?.results?.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: r.is_correct ? 'rgba(0,200,150,0.08)' : 'rgba(255,107,53,0.08)', border: `1px solid ${r.is_correct ? 'rgba(0,200,150,0.2)' : 'rgba(255,107,53,0.2)'}` }}>
                        <span style={{ fontSize: '1.1rem' }}>{r.is_correct ? '✅' : '❌'}</span>
                        <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 600 }}>
                          Q{i + 1}: {r.is_correct ? 'Correct!' : `Answer was "${r.correct_answer}"`}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: r.is_correct ? '#00C896' : 'var(--text3)' }}>+{r.points_earned} pts</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => router.back()}
                    className="btn-secondary"
                    style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                    ← Back to Lesson
                  </button>
                  {!result.passed && (
                    <button onClick={() => { setResult(null); setAnswers({}); setCurrentQ(0); setRevealed(false); }}
                      className="btn-primary"
                      style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                      🔁 Try Again
                    </button>
                  )}
                  {result.passed && (
                    <button onClick={() => router.back()}
                      style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', borderRadius: '999px', background: 'linear-gradient(135deg,#FFD93D,#f59e0b)', color: '#1A1A2E', fontWeight: 700, fontFamily: "'Baloo 2'", border: 'none', cursor: 'pointer' }}>
                      🏆 Continue →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        ) : (
          /* ── QUESTION SCREEN ── */
          <>
            {/* Progress bar */}
            <div className="animate-fadeUp" style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text3)', marginBottom: '0.5rem' }}>
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span style={{ color: 'var(--primary)' }}>{assessment.pass_score} pts to pass</span>
              </div>
              <div style={{ height: '7px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', width: `${progressPct}%`, borderRadius: '999px', transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
              </div>
              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => setCurrentQ(i)}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid', borderColor: i === currentQ ? 'var(--primary)' : answers[q.id] ? 'var(--accent)' : 'var(--border)', background: i === currentQ ? 'var(--primary)' : answers[q.id] ? 'var(--accent)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.6rem', fontWeight: 700, color: i === currentQ || answers[q.id] ? '#fff' : 'var(--text3)' }}>
                    {answers[q.id] ? '✓' : i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question card */}
            {question && (
              <div className="animate-popIn" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '2rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,107,53,0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{currentQ + 1}</span>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.5, margin: 0, paddingTop: '0.3rem' }}>{question.question_text}</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(question.options_json ?? []).map((opt, oi) => {
                    const selected = answers[question.id] === opt.value;
                    const labels = ['A', 'B', 'C', 'D'];
                    return (
                      <button key={opt.value} onClick={() => setAnswers(prev => ({ ...prev, [question.id]: opt.value }))}
                        style={{ width: '100%', textAlign: 'left', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: '2px solid', borderColor: selected ? 'var(--primary)' : 'var(--border)', background: selected ? 'rgba(255,107,53,0.07)' : 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: "'Baloo 2'", transition: 'all 0.2s', transform: selected ? 'scale(1.01)' : 'scale(1)' }}
                        onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--text3)'; }}
                        onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)'; }}>
                        <span style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', background: selected ? 'var(--primary)' : 'var(--border)', color: selected ? '#fff' : 'var(--text3)', transition: 'all 0.2s' }}>
                          {labels[oi] ?? opt.value}
                        </span>
                        <span style={{ fontSize: '0.92rem', fontWeight: selected ? 700 : 500, color: selected ? 'var(--primary)' : 'var(--text2)' }}>{opt.label}</span>
                        {selected && <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: '1.5px solid var(--border)', background: 'var(--card)', color: 'var(--text2)', fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: '0.88rem', cursor: currentQ === 0 ? 'not-allowed' : 'pointer', opacity: currentQ === 0 ? 0.4 : 1, transition: 'all 0.2s' }}>
                ← Previous
              </button>

              {currentQ < questions.length - 1 ? (
                <button onClick={() => setCurrentQ(q => q + 1)}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                  Next →
                </button>
              ) : (
                <button onClick={submitQuiz} disabled={!allAnswered || submitting}
                  style={{ padding: '0.65rem 1.75rem', borderRadius: '999px', background: allAnswered ? 'linear-gradient(135deg, var(--accent), #00a87a)' : 'var(--border)', color: allAnswered ? '#fff' : 'var(--text3)', fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: '0.92rem', border: 'none', cursor: allAnswered ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: allAnswered ? '0 4px 14px rgba(0,200,150,0.35)' : 'none' }}>
                  {submitting ? '⏳ Submitting…' : '✓ Submit Quiz'}
                </button>
              )}
            </div>

            {!allAnswered && currentQ === questions.length - 1 && (
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.75rem' }}>
                Answer all {questions.length} questions to submit
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
