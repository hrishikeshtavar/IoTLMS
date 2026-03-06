'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Locale = 'en' | 'hi' | 'mr';

const T: Record<Locale, Record<string, string>> = {
  en: {
    title: 'All Courses',
    search_placeholder: 'Search courses...',
    filter_all: 'All',
    enroll: 'Start Learning',
    view: 'View',
    enrolled: 'Enrolled ✓',
    loading: 'Loading courses...',
    empty: 'No courses found. Try a different search.',
    badge_live: 'LIVE',
    students: 'students',
    lessons: 'lessons',
    back_home: '← Home',
  },
  hi: {
    title: 'सभी कोर्स',
    search_placeholder: 'कोर्स खोजें...',
    filter_all: 'सभी',
    enroll: 'सीखना शुरू करें',
    view: 'देखें',
    enrolled: 'एनरोल ✓',
    loading: 'कोर्स लोड हो रहे हैं...',
    empty: 'कोई कोर्स नहीं मिला।',
    badge_live: 'लाइव',
    students: 'छात्र',
    lessons: 'पाठ',
    back_home: '← होम',
  },
  mr: {
    title: 'सर्व कोर्स',
    search_placeholder: 'कोर्स शोधा...',
    filter_all: 'सर्व',
    enroll: 'शिकणे सुरू करा',
    view: 'पहा',
    enrolled: 'नोंदणी ✓',
    loading: 'कोर्स लोड होत आहेत...',
    empty: 'कोणताही कोर्स सापडला नाही.',
    badge_live: 'थेट',
    students: 'विद्यार्थी',
    lessons: 'धडे',
    back_home: '← मुख्यपृष्ठ',
  },
};

const categoryColors: Record<string, string> = {
  Arduino:    '#00C896',
  'Raspberry Pi': '#A855F7',
  ARM:        '#1A73E8',
  'RISC-V':   '#FF6B35',
  ESP32:      '#FFD93D',
  Sensors:    '#00C896',
  Electronics: '#FF6B35',
  IoT:        '#1A73E8',
  General:    '#718096',
};

interface Course {
  id: string;
  title: string;
  title_hi?: string;
  title_mr?: string;
  category?: string;
  status?: string;
  _count?: { enrollments?: number; lessons?: number };
  enrollmentPercent?: number;
}

function ProgressRing({ percent, size = 44, color = '#FF6B35' }: { percent: number; size?: number; color?: string }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#eee" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="progress-ring-circle" />
      <text x="50%" y="54%" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{percent}%</text>
    </svg>
  );
}

export default function CoursesPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('iotlearn_locale') as Locale;
    if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved);

    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || []);
        setCourses(list.map((c: Course) => ({ ...c, enrollmentPercent: Math.floor(Math.random() * 85) + 10 })));
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const switchLocale = (l: Locale) => { setLocale(l); localStorage.setItem('iotlearn_locale', l); };

  const categories = ['', ...Array.from(new Set(courses.map(c => c.category || 'General').filter(Boolean)))];
  const t = T[locale];
  const isDevanagari = locale !== 'en';

  const filtered = courses.filter(c => {
    const title = (locale === 'hi' ? c.title_hi : locale === 'mr' ? c.title_mr : null) || c.title;
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || (c.category || 'General') === activeCategory;
    return matchSearch && matchCat;
  });

  const handleEnroll = async (courseId: string) => {
    try {
      await fetch('/api/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId, userId: 'student-1' }) });
      setEnrolledIds(prev => new Set([...prev, courseId]));
    } catch { setEnrolledIds(prev => new Set([...prev, courseId])); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>⚡ IoTLearn</Link>
          <Link href="/" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{t.back_home}</Link>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['en','hi','mr'] as Locale[]).map(l => (
            <button key={l} onClick={() => switchLocale(l)}
              style={{ padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1.5px solid', borderColor: locale === l ? 'var(--primary)' : 'var(--border)', background: locale === l ? 'var(--primary)' : 'transparent', color: locale === l ? '#fff' : 'var(--text2)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: l !== 'en' ? 'Noto Sans Devanagari' : 'Baloo 2', transition: 'all 0.2s' }}>
              {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
            </button>
          ))}
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--text) 0%, #2d2d4e 100%)', padding: 'clamp(2.5rem,6vw,4rem) 2rem', position: 'relative', overflow: 'hidden' }}>
        {['💡','📡','⚙️','🔌','🤖'].map((em, i) => (
          <div key={i} className="animate-float" style={{ position: 'absolute', fontSize: '1.5rem', opacity: 0.08, left: `${i * 22 + 5}%`, top: `${(i * 17) % 60 + 10}%`, animationDelay: `${i * 0.5}s` }}>{em}</div>
        ))}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`}
            style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            {t.title}
          </h1>

          {/* Search */}
          <div className="animate-fadeUp delay-100" style={{ maxWidth: '480px', margin: '1.5rem auto 0', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t.search_placeholder}
              className={isDevanagari ? 'lang-hi' : ''}
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '999px', border: '2px solid transparent', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', fontFamily: isDevanagari ? 'Noto Sans Devanagari' : 'Baloo 2', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'transparent')} />
          </div>

          {/* Category filter pills */}
          <div className="animate-fadeUp delay-200" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {categories.map(cat => (
              <button key={cat || '__all'} onClick={() => setActiveCategory(cat)}
                style={{ padding: '0.35rem 1rem', borderRadius: '999px', border: '1.5px solid', borderColor: activeCategory === cat ? (cat ? categoryColors[cat] || 'var(--primary)' : 'var(--primary)') : 'rgba(255,255,255,0.2)', background: activeCategory === cat ? (cat ? categoryColors[cat] || 'var(--primary)' : 'var(--primary)') : 'transparent', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {cat || t.filter_all}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COURSES GRID */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.1rem', color: 'var(--text3)' }}>
            <div className="animate-spin" style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
            <div className={isDevanagari ? 'lang-hi' : ''}>{t.loading}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <div className={isDevanagari ? 'lang-hi' : ''}>{t.empty}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((course, i) => {
              const displayTitle = (locale === 'hi' ? course.title_hi : locale === 'mr' ? course.title_mr : null) || course.title;
              const cat = course.category || 'General';
              const catColor = categoryColors[cat] || '#718096';
              const isEnrolled = enrolledIds.has(course.id);
              const pct = course.enrollmentPercent || 0;
              return (
                <div key={course.id} className={`card-hover animate-popIn delay-${Math.min((i % 5 + 1) * 100, 500)}`}
                  style={{ background: 'var(--card)', borderRadius: '1.25rem', border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  {/* Card top bar */}
                  <div style={{ height: '5px', background: `linear-gradient(90deg, ${catColor}, ${catColor}88)` }} />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: catColor + '22', color: catColor, borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                          {cat}
                        </span>
                        {course.status === 'published' && (
                          <span style={{ marginLeft: '0.5rem', display: 'inline-block', padding: '0.2rem 0.6rem', background: 'rgba(0,200,150,0.15)', color: '#00C896', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {t.badge_live}
                          </span>
                        )}
                      </div>
                      <ProgressRing percent={pct} color={catColor} />
                    </div>
                    <h3 className={isDevanagari ? 'lang-hi' : ''} style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {displayTitle}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>
                      <span>👥 {(course._count?.enrollments || 0).toLocaleString('en-IN')} {t.students}</span>
                      <span>📚 {course._count?.lessons || 0} {t.lessons}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => handleEnroll(course.id)} disabled={isEnrolled}
                        className={`btn-primary ${isDevanagari ? 'lang-hi' : ''}`}
                        style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.85rem', opacity: isEnrolled ? 0.7 : 1, background: isEnrolled ? 'var(--accent)' : undefined }}>
                        {isEnrolled ? t.enrolled : t.enroll}
                      </button>
                      <Link href={`/courses/${course.id}`}
                        className={`btn-secondary ${isDevanagari ? 'lang-hi' : ''}`}
                        style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                        {t.view}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
