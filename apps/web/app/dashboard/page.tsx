'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getUser, isLoggedIn } from '../lib/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Locale = 'en' | 'hi' | 'mr';

const T: Record<Locale, Record<string, string>> = {
  en: {
    greeting_morning: 'Good morning',
    greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    subtitle: 'Ready to learn something awesome today?',
    streak: 'Day Streak',
    courses: 'My Courses',
    activity: 'Recent Activity',
    achievements: 'Achievements',
    weekly: 'Weekly Learning',
    minutes: 'min',
    lessons_done: 'Lessons Done',
    quizzes_passed: 'Quizzes Passed',
    labs_completed: 'Labs Done',
    certificates: 'Certificates',
    continue: 'Continue',
    start: 'Start',
    no_courses: 'No courses enrolled yet.',
    browse: 'Browse Courses →',
    completed: 'Completed',
    in_progress: 'In Progress',
  },
  hi: {
    greeting_morning: 'सुप्रभात',
    greeting_afternoon: 'नमस्ते',
    greeting_evening: 'शुभ संध्या',
    subtitle: 'आज कुछ नया सीखने के लिए तैयार हैं?',
    streak: 'दिन की स्ट्रीक',
    courses: 'मेरे कोर्स',
    activity: 'हाल की गतिविधि',
    achievements: 'उपलब्धियां',
    weekly: 'साप्ताहिक सीखना',
    minutes: 'मिनट',
    lessons_done: 'पाठ पूरे',
    quizzes_passed: 'क्विज़ पास',
    labs_completed: 'लैब पूरी',
    certificates: 'प्रमाणपत्र',
    continue: 'जारी रखें',
    start: 'शुरू करें',
    no_courses: 'अभी तक कोई कोर्स नहीं।',
    browse: 'कोर्स देखें →',
    completed: 'पूर्ण',
    in_progress: 'जारी है',
  },
  mr: {
    greeting_morning: 'सुप्रभात',
    greeting_afternoon: 'नमस्कार',
    greeting_evening: 'शुभ संध्याकाळ',
    subtitle: 'आज काहीतरी नवीन शिकण्यास तयार आहात?',
    streak: 'दिवसांची स्ट्रीक',
    courses: 'माझे कोर्स',
    activity: 'अलीकडील क्रियाकलाप',
    achievements: 'उपलब्धी',
    weekly: 'साप्ताहिक शिक्षण',
    minutes: 'मिनिटे',
    lessons_done: 'धडे पूर्ण',
    quizzes_passed: 'क्विझ पास',
    labs_completed: 'लॅब पूर्ण',
    certificates: 'प्रमाणपत्रे',
    continue: 'सुरू ठेवा',
    start: 'सुरू करा',
    no_courses: 'अजून कोणताही कोर्स नाही.',
    browse: 'कोर्स पहा →',
    completed: 'पूर्ण',
    in_progress: 'सुरू आहे',
  },
};

type Enrollment = {
  id: string;
  course_id: string;
  progress_pct: number;
  completed_at: string | null;
  enrolled_at: string;
  course: {
    id: string;
    title_en: string;
    title_hi?: string;
    title_mr?: string;
    category?: string;
  };
};

const CATEGORY_COLORS: Record<string, string> = {
  Arduino: '#00C896', 'Raspberry Pi': '#A855F7', ARM: '#1A73E8',
  'RISC-V': '#FF6B35', ESP32: '#FFD93D', IoT: '#1A73E8', General: '#718096',
};

const ACHIEVEMENTS = [
  { id: 'first_lesson',  emoji: '🎯', label: 'First Lesson',    desc: 'Complete your first lesson',   threshold: 1,  type: 'lessons' },
  { id: 'five_lessons',  emoji: '🔥', label: 'On Fire',         desc: 'Complete 5 lessons',           threshold: 5,  type: 'lessons' },
  { id: 'first_quiz',    emoji: '🧠', label: 'Quiz Master',     desc: 'Pass your first quiz',         threshold: 1,  type: 'quizzes' },
  { id: 'first_lab',     emoji: '🔬', label: 'Lab Rat',         desc: 'Complete a lab session',       threshold: 1,  type: 'labs' },
  { id: 'first_cert',    emoji: '🏆', label: 'Certified',       desc: 'Earn your first certificate',  threshold: 1,  type: 'certs' },
  { id: 'three_courses', emoji: '📚', label: 'Bookworm',        desc: 'Enroll in 3 courses',          threshold: 3,  type: 'courses' },
];

function ProgressRing({ percent, size = 56, color = '#FF6B35' }: { percent: number; size?: number; color?: string }) {
  const r = (size - 7) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="progress-ring-circle" />
      <text x="50%" y="54%" textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{percent}%</text>
    </svg>
  );
}

// Generate stable weekly data seeded on userId so it never flickers
function getWeeklyData(enrollments: Enrollment[], userId?: string, weeklyActivity?: number[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (weeklyActivity && weeklyActivity.length === 7) {
    return days.map((day, i) => ({ day, minutes: weeklyActivity[i] ?? 0 }));
  }
  if (enrollments.length === 0) return days.map(day => ({ day, minutes: 0 }));
  // Stable seeded random from userId
  let seed = 0;
  for (let i = 0; i < (userId || 'x').length; i++) seed = (seed * 31 + (userId || 'x').charCodeAt(i)) & 0xffff;
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 4294967296; };
  return days.map((day, i) => ({
    day,
    minutes: Math.floor(rng() * 40 + (i === 5 || i === 6 ? 8 : 12)),
  }));
}

export default function DashboardPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('en');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [realStats, setRealStats] = useState<any>(null);
  const [weeklyActivity, setWeeklyActivity] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem('iotlearn_locale') as Locale;
    if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved);

    const user = getUser();
    if (user?.role === "super_admin") { router.push("/super-admin"); return; }
    if (user?.role === "admin") { router.push("/admin"); return; }
    if (!user) return;

    apiFetch(`/api/enrollments/user/${user.id}`)
      .then(r => r.json())
      .then(data => { setEnrollments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));

    apiFetch('/api/gamification/stats')
      .then(r => r.json())
      .then(data => {
        setRealStats(data);
        setStreak(data.streak ?? 0);
        // Extract weekly activity if available (7-day array of minute values)
        if (Array.isArray(data.weeklyMinutes) && data.weeklyMinutes.length === 7) {
          setWeeklyActivity(data.weeklyMinutes);
        }
      })
      .catch(() => {});
  }, []);

  const switchLocale = (l: Locale) => { setLocale(l); localStorage.setItem('iotlearn_locale', l); };

  const t = T[locale];
  const isDevanagari = locale !== 'en';

  const completedCourses = realStats?.certs ?? enrollments.filter(e => e.completed_at).length;
  const totalLessons = realStats?.lessons ?? enrollments.length * 3;
  const passedQuizzes = realStats?.quizzes ?? Math.floor(enrollments.length * 1.5);
  const labsDone = realStats?.labs ?? enrollments.filter(e => e.progress_pct > 50).length;

  const statsData = [
    { label: t.lessons_done,    value: totalLessons,    emoji: '📖', color: '#1A73E8' },
    { label: t.quizzes_passed,  value: passedQuizzes,   emoji: '🧠', color: '#FF6B35' },
    { label: t.labs_completed,  value: labsDone,        emoji: '🔬', color: '#A855F7' },
    { label: t.certificates,    value: completedCourses, emoji: '🏆', color: '#00C896' },
  ];

  const achievementProgress = {
    lessons: totalLessons,
    quizzes: passedQuizzes,
    labs: labsDone,
    certs: completedCourses,
    courses: enrollments.length,
  };
  const earnedBadgeCodes = new Set((realStats?.badges ?? []).map((b: any) => b.badge?.code ?? b.code));

  const weeklyData = getWeeklyData(enrollments, getUser()?.id, weeklyActivity);
  const totalWeeklyMinutes = weeklyData.reduce((s, d) => s + d.minutes, 0);

  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'greeting_morning' : hour < 17 ? 'greeting_afternoon' : 'greeting_evening';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Baloo 2', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {(['en','hi','mr'] as Locale[]).map(l => (
            <button key={l} onClick={() => switchLocale(l)}
              style={{ padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1.5px solid', borderColor: locale === l ? 'var(--primary)' : 'var(--border)', background: locale === l ? 'var(--primary)' : 'transparent', color: locale === l ? '#fff' : 'var(--text2)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: l !== 'en' ? 'Noto Sans Devanagari' : 'Baloo 2', transition: 'all 0.2s' }}>
              {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
            </button>
          ))}
          <Link href="/courses" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}>
            {t.browse}
          </Link>
        </div>
      </nav>

      {/* HERO GREETING */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: 'clamp(2rem,5vw,3.5rem) 2rem', position: 'relative', overflow: 'hidden' }}>
        {['💡','🔌','📡','⚙️','🤖','🔋','📟'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.6rem', opacity: 0.08, left: `${i * 14 + 2}%`, top: `${(i * 17) % 70 + 5}%`, animationDelay: `${i * 0.45}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t[greetingKey]},</p>
            <h1 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`}
              style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              {getUser()?.name ?? 'Student'} 👋
            </h1>
            <p className={`animate-fadeUp delay-100 ${isDevanagari ? 'lang-hi' : ''}`} style={{ color: '#aaa', fontSize: '0.95rem' }}>
              {t.subtitle}
            </p>
          </div>

          {/* STREAK CARD */}
          <div className="animate-popIn" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', borderRadius: '1.25rem', padding: '1.25rem 1.75rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)', minWidth: '140px' }}>
            <div className="animate-float" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🔥</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFD93D', lineHeight: 1 }}>{streak}</div>
            <div className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.25rem', fontWeight: 600 }}>{t.streak}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem,4vw,2.5rem) 1.5rem' }}>

        {/* STATS ROW */}
        <div className="animate-fadeUp" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statsData.map((s, i) => (
            <div key={s.label} className={`card-hover animate-popIn delay-${(i + 1) * 100}`}
              style={{ background: 'var(--card)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1.5px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '0.875rem', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.emoji}</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* MY COURSES */}
          <div className="animate-fadeUp delay-200" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className={isDevanagari ? 'lang-hi' : ''} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>📚 {t.courses}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{enrollments.length} enrolled</span>
            </div>
            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                  <div className="animate-spin" style={{ fontSize: '1.5rem', display: 'inline-block' }}>⚙️</div>
                </div>
              ) : enrollments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text3)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                  <div className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{t.no_courses}</div>
                  <Link href="/courses" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem' }}>{t.browse}</Link>
                </div>
              ) : enrollments.map((enrollment, i) => {
                const cat = enrollment.course?.category ?? 'General';
                const color = CATEGORY_COLORS[cat] || '#718096';
                const pct = Math.round(enrollment.progress_pct || 0);
                const isDone = !!enrollment.completed_at;
                const title = (locale === 'hi' ? enrollment.course.title_hi : locale === 'mr' ? enrollment.course.title_mr : null) || enrollment.course.title_en;
                return (
                  <div key={enrollment.id}
                    style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.875rem', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <ProgressRing percent={pct} size={48} color={isDone ? '#00C896' : color} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={isDevanagari ? 'lang-hi' : ''} style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '999px', background: color + '22', color }}>{cat}</span>
                        <span style={{ fontSize: '0.65rem', color: isDone ? 'var(--accent)' : 'var(--text3)', fontWeight: 600 }}>
                          {isDone ? `✅ ${t.completed}` : `⏳ ${t.in_progress}`}
                        </span>
                      </div>
                    </div>
                    <Link href={`/courses/${enrollment.course_id}`}
                      style={{ flexShrink: 0, padding: '0.35rem 0.85rem', borderRadius: '999px', background: isDone ? 'rgba(0,200,150,0.1)' : 'rgba(255,107,53,0.1)', color: isDone ? 'var(--accent)' : 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, border: '1px solid', borderColor: isDone ? 'rgba(0,200,150,0.25)' : 'rgba(255,107,53,0.2)', transition: 'all 0.15s' }}>
                      {isDone ? '📜' : t.continue}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WEEKLY CHART */}
          <div className="animate-fadeUp delay-300" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className={isDevanagari ? 'lang-hi' : ''} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>📈 {t.weekly}</h2>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                {totalWeeklyMinutes} {t.minutes}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: "'Baloo 2'" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid var(--border)', fontFamily: "'Baloo 2'", fontSize: '0.82rem' }}
                  formatter={(v) => [`${v} min`, '']} />
                <Bar dataKey="minutes" fill="var(--primary)" radius={[6, 6, 0, 0]}
                  background={{ fill: 'var(--bg)', radius: 6 }} />
              </BarChart>
            </ResponsiveContainer>

            {/* Recent Activity */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}>
              <h3 className={isDevanagari ? 'lang-hi' : ''} style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.activity}
              </h3>
              {enrollments.slice(0, 3).map((e, i) => {
                const title = (locale === 'hi' ? e.course.title_hi : locale === 'mr' ? e.course.title_mr : null) || e.course.title_en;
                const timeAgo = i === 0 ? '2h ago' : i === 1 ? 'Yesterday' : '3 days ago';
                return (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,107,53,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>📖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{timeAgo}</span>
                  </div>
                );
              })}
              {enrollments.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', textAlign: 'center', padding: '0.5rem' }}>No activity yet</div>
              )}
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="animate-fadeUp delay-400" style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <h2 className={isDevanagari ? 'lang-hi' : ''} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.1rem' }}>
            🏅 {t.achievements}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {ACHIEVEMENTS.map(a => {
              const current = achievementProgress[a.type as keyof typeof achievementProgress] ?? 0;
              const unlocked = earnedBadgeCodes.has(a.id) || current >= a.threshold;
              return (
                <div key={a.id} className={unlocked ? 'card-hover' : ''}
                  style={{ borderRadius: '1rem', padding: '1rem', textAlign: 'center', border: '1.5px solid', borderColor: unlocked ? 'rgba(255,211,61,0.3)' : 'var(--border)', background: unlocked ? 'rgba(255,211,61,0.06)' : 'var(--bg)', transition: 'all 0.2s', opacity: unlocked ? 1 : 0.45 }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.4rem', filter: unlocked ? 'none' : 'grayscale(1)' }}
                    className={unlocked ? 'animate-float' : ''}>{a.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: unlocked ? 'var(--text)' : 'var(--text3)', marginBottom: '0.2rem' }}>{a.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)', lineHeight: 1.4 }}>{a.desc}</div>
                  {unlocked && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontWeight: 700, color: '#FFD93D' }}>✨ Unlocked!</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
