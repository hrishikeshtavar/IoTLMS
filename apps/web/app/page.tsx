'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type Locale = 'en' | 'hi' | 'mr';

const T: Record<Locale, Record<string, string>> = {
  en: {
    nav_explore: 'Explore Courses',
    nav_admin: 'Admin Panel',
    hero_badge: '⚡ K-12 IoT Education Platform',
    hero_title: 'Learn IoT the Fun Way',
    hero_sub: 'Interactive labs, quizzes, and certificates for school students.',
    hero_cta: 'Explore Courses',
    hero_admin: 'Admin Panel',
    stats_students: 'Students',
    stats_courses: 'Courses',
    stats_schools: 'Schools',
    stats_certs: 'Certificates',
    topics_title: 'What You\'ll Learn',
    features_title: 'Built for Indian Schools',
    cta_title: 'Ready to Start Learning?',
    cta_sub: 'Join students across India mastering IoT.',
    cta_btn: 'Get Started Free',
    footer_copy: 'IoTLearn LMS — Built for Indian IoT Education 🇮🇳',
  },
  hi: {
    nav_explore: 'कोर्स देखें',
    nav_admin: 'एडमिन',
    hero_badge: '⚡ K-12 IoT शिक्षा प्लेटफ़ॉर्म',
    hero_title: 'मज़ेदार तरीके से IoT सीखें',
    hero_sub: 'स्कूली छात्रों के लिए इंटरेक्टिव लैब, क्विज़ और सर्टिफ़िकेट।',
    hero_cta: 'कोर्स देखें',
    hero_admin: 'एडमिन पैनल',
    stats_students: 'छात्र',
    stats_courses: 'कोर्स',
    stats_schools: 'स्कूल',
    stats_certs: 'सर्टिफ़िकेट',
    topics_title: 'क्या सीखेंगे',
    features_title: 'भारतीय स्कूलों के लिए बना',
    cta_title: 'सीखना शुरू करें?',
    cta_sub: 'भारत भर के छात्रों के साथ IoT सीखें।',
    cta_btn: 'मुफ़्त शुरू करें',
    footer_copy: 'IoTLearn LMS — भारतीय IoT शिक्षा के लिए 🇮🇳',
  },
  mr: {
    nav_explore: 'कोर्स पहा',
    nav_admin: 'प्रशासक',
    hero_badge: '⚡ K-12 IoT शिक्षण व्यासपीठ',
    hero_title: 'मजेत IoT शिका',
    hero_sub: 'शाळकरी विद्यार्थ्यांसाठी इंटरॅक्टिव्ह लॅब, क्विझ आणि प्रमाणपत्रे।',
    hero_cta: 'कोर्स पहा',
    hero_admin: 'प्रशासक पॅनेल',
    stats_students: 'विद्यार्थी',
    stats_courses: 'कोर्स',
    stats_schools: 'शाळा',
    stats_certs: 'प्रमाणपत्रे',
    topics_title: 'काय शिकाल',
    features_title: 'भारतीय शाळांसाठी बनवले',
    cta_title: 'शिकणे सुरू करायचे?',
    cta_sub: 'भारतभरातील विद्यार्थ्यांसोबत IoT शिका।',
    cta_btn: 'मोफत सुरू करा',
    footer_copy: 'IoTLearn LMS — भारतीय IoT शिक्षणासाठी 🇮🇳',
  },
};

const TOPICS = [
  { emoji: '🤖', label: 'Arduino', color: '#00C896' },
  { emoji: '🍓', label: 'Raspberry Pi', color: '#A855F7' },
  { emoji: '💪', label: 'ARM', color: '#1A73E8' },
  { emoji: '⚡', label: 'RISC-V', color: '#FF6B35' },
  { emoji: '📡', label: 'ESP32 / WiFi', color: '#FFD93D' },
  { emoji: '🔌', label: 'Sensors', color: '#00C896' },
  { emoji: '🔋', label: 'Electronics', color: '#FF6B35' },
  { emoji: '🌐', label: 'IoT Protocols', color: '#1A73E8' },
];

const FEATURES = [
  { emoji: '🔬', title: 'Interactive Labs', desc: 'Browser-based Arduino & ESP32 simulator. No hardware needed.', color: '#00C896' },
  { emoji: '📱', title: 'Mobile + Offline', desc: 'PWA works offline. Students in low-bandwidth areas can still learn.', color: '#1A73E8' },
  { emoji: '🏫', title: 'White-Labeled', desc: 'Your school logo, colors, and domain. Students see your brand.', color: '#A855F7' },
  { emoji: '🏆', title: 'Auto Certificates', desc: 'Generated completion certificates with school branding on finish.', color: '#FFD93D' },
];

const STATS = [
  { key: 'stats_students', target: 2400 },
  { key: 'stats_courses', target: 48 },
  { key: 'stats_schools', target: 120 },
  { key: 'stats_certs', target: 890 },
];

const FLOAT_EMOJIS = ['💡','🔌','📟','⚙️','🔧','📡','🖥️','🔋','🛠️','💻'];

function useCountUp(target: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 24);
    return () => clearInterval(timer);
  }, [target, start]);
  return count;
}

function StatCard({ labelKey, target, locale, started }: { labelKey: string; target: number; locale: Locale; started: boolean }) {
  const count = useCountUp(target, started);
  const isDevanagari = locale !== 'en';
  return (
    <div className="text-center">
      <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff' }}>
        {count.toLocaleString('en-IN')}+
      </div>
      <div className={`text-sm font-semibold opacity-80 text-white mt-1 ${isDevanagari ? 'lang-hi' : ''}`}>
        {T[locale][labelKey]}
      </div>
    </div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('iotlearn_locale') as Locale;
    if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const switchLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem('iotlearn_locale', l);
  };

  const t = T[locale];
  const isDevanagari = locale !== 'en';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,248,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
          ⚡ <span style={{ color: 'var(--text)' }}>IoTLearn</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {(['en','hi','mr'] as Locale[]).map(l => (
            <button key={l} onClick={() => switchLocale(l)}
              style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: '1.5px solid', borderColor: locale === l ? 'var(--primary)' : 'var(--border)', background: locale === l ? 'var(--primary)' : 'transparent', color: locale === l ? '#fff' : 'var(--text2)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: l !== 'en' ? 'Noto Sans Devanagari' : 'Baloo 2', transition: 'all 0.2s' }}>
              {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
            </button>
          ))}
          <Link href="/courses" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            {t.nav_explore}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(4rem,10vw,8rem) 2rem', textAlign: 'center' }}>
        {/* Floating emoji background */}
        {FLOAT_EMOJIS.map((em, i) => (
          <div key={i} className={`animate-float delay-${(i % 5 + 1) * 100}`} style={{ position: 'absolute', fontSize: 'clamp(1.2rem,2vw,2rem)', opacity: 0.12, left: `${(i * 9.3) % 90 + 2}%`, top: `${(i * 13.7) % 80 + 5}%`, animationDelay: `${i * 0.4}s`, pointerEvents: 'none' }}>{em}</div>
        ))}
        {/* Gradient blobs */}
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '28rem', height: '28rem', background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '20rem', height: '20rem', background: 'radial-gradient(circle, rgba(26,115,232,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div className="animate-fadeUp" style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(255,107,53,0.12)', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            {t.hero_badge}
          </div>

          {/* Robot with orbiting emojis */}
          <div className="animate-popIn" style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 'clamp(3.5rem,8vw,5.5rem)' }}>🤖</div>
            {['💡','🔌','📡','⚙️'].map((em, i) => (
              <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', fontSize: '1.1rem', animation: `orbitSpin ${3 + i * 0.5}s linear infinite`, animationDelay: `${i * 0.7}s`, transformOrigin: '0 0' }}>{em}</div>
            ))}
          </div>

          <h1 className={`animate-fadeUp delay-100 ${isDevanagari ? 'lang-hi' : ''}`}
            style={{ fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', background: 'linear-gradient(135deg, var(--text), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.hero_title}
          </h1>
          <p className={`animate-fadeUp delay-200 ${isDevanagari ? 'lang-hi' : ''}`}
            style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', color: 'var(--text2)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            {t.hero_sub}
          </p>
          <div className="animate-fadeUp delay-300" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" className="btn-primary">{t.hero_cta} →</Link>
            <Link href="/admin" className="btn-secondary">{t.hero_admin}</Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div ref={statsRef} style={{ background: 'linear-gradient(135deg, var(--primary), #ff8c5a)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
          {STATS.map(s => <StatCard key={s.key} labelKey={s.key} target={s.target} locale={locale} started={statsStarted} />)}
        </div>
      </div>

      {/* TOPICS GRID */}
      <section style={{ padding: 'clamp(3rem,8vw,6rem) 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`}
          style={{ textAlign: 'center', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, marginBottom: '2.5rem', color: 'var(--text)' }}>
          {t.topics_title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {TOPICS.map((topic, i) => (
            <div key={i} className={`card-hover animate-popIn delay-${Math.min((i % 5 + 1) * 100, 500)}`}
              style={{ background: 'var(--card)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center', border: '1.5px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{topic.emoji}</div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{topic.label}</div>
              <div style={{ height: '3px', width: '40%', background: topic.color, borderRadius: '2px', margin: '0.5rem auto 0' }} />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(3rem,8vw,5rem) 2rem', background: 'var(--card)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`}
            style={{ textAlign: 'center', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, marginBottom: '2.5rem', color: 'var(--text)' }}>
            {t.features_title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`card-hover animate-fadeUp delay-${(i % 4 + 1) * 100}`}
                style={{ background: 'var(--bg)', borderRadius: '1.25rem', padding: '1.75rem', border: '1.5px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: f.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>{f.emoji}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARK CTA BANNER */}
      <section style={{ background: 'var(--text)', padding: 'clamp(3rem,8vw,5rem) 2rem', textAlign: 'center' }}>
        <div className="animate-float" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
        <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`}
          style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t.cta_title}
        </h2>
        <p className={`animate-fadeUp delay-100 ${isDevanagari ? 'lang-hi' : ''}`}
          style={{ color: '#aaa', marginBottom: '2rem', fontSize: '1.05rem' }}>
          {t.cta_sub}
        </p>
        <Link href="/courses" className="btn-primary">{t.cta_btn} 🚀</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <p className={isDevanagari ? 'lang-hi' : ''} style={{ color: '#666', fontSize: '0.9rem' }}>{t.footer_copy}</p>
        <Link href="/admin" style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>Admin →</Link>
      </footer>
    </div>
  );
}
