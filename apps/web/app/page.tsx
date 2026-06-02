'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { SimuRobot } from '@/components/ui/simu-robot';
import { DottedSurface } from '@/components/ui/dotted-surface';

const T = {
  en: {
    tagline: 'K-12 AI & IoT Learning Platform',
    hero1: 'Learn AI & IoT',
    hero2: 'From Grade 1 to 12',
    heroSub: 'Hands-on virtual IoT labs, smart quizzes, gamified badges and verified certificates — built for every Indian school student.',
    exploreCourses: 'Explore Courses →',
    schoolLogin: 'School Login',
    studentLogin: 'Student Login',
    featTitle: 'Everything a Student Needs',
    featSub: 'One platform, one complete learning journey',
    howTitle: 'How It Works',
    howSub: 'Three simple steps from school to certificate',
    step1t: 'School Onboards', step1d: 'Admin uploads student roster and assigns courses by grade',
    step2t: 'Students Learn', step2d: 'Watch lessons, run IoT labs, take quizzes, earn badges',
    step3t: 'Get Certified', step3d: 'Score 60%+ and receive a tamper-proof digital certificate',
    ctaTitle: 'Bring SimuLearning to Your School',
    ctaSub: 'Students access the platform through their school. If you are an administrator, onboard your institution today.',
    onboardSchool: 'Onboard Your School →',
    statsStudents: 'Students', statsCourses: 'Courses', statsSchools: 'Schools', statsCerts: 'Certificates',
    by: 'by SimuSoft Technologies',
    features: [
      { icon: '🔬', title: 'Virtual IoT Labs', desc: 'Run real Wokwi simulations — blink LEDs, read sensors, control motors — right in your browser.' },
      { icon: '🏆', title: 'Gamified Progress', desc: 'Earn XP, unlock badges, maintain streaks and climb your school leaderboard.' },
      { icon: '📜', title: 'Verified Certificates', desc: 'Complete a course and get a tamper-proof digital certificate with a unique QR code.' },
      { icon: '🧠', title: 'Smart Quizzes', desc: 'MCQ assessments graded instantly with per-question feedback.' },
      { icon: '📊', title: 'Analytics', desc: 'Live class dashboards — completion rates, quiz scores, lab attempts for teachers.' },
      { icon: '🌐', title: '3 Languages', desc: 'Full content in English, हिंदी and मराठी — every student learns in comfort.' },
    ],
  },
  hi: {
    tagline: 'K-12 AI और IoT शिक्षण मंच',
    hero1: 'AI & IoT सीखें',
    hero2: 'कक्षा 1 से 12 तक',
    heroSub: 'वर्चुअल IoT लैब, स्मार्ट क्विज़, गेमिफाइड बैज और सत्यापित प्रमाणपत्र — हर भारतीय स्कूली छात्र के लिए।',
    exploreCourses: 'कोर्स देखें →',
    schoolLogin: 'स्कूल लॉगिन',
    studentLogin: 'छात्र लॉगिन',
    featTitle: 'छात्र को जो चाहिए वो सब',
    featSub: 'एक मंच, पूरी शिक्षा यात्रा',
    howTitle: 'कैसे काम करता है',
    howSub: 'स्कूल से प्रमाणपत्र तक तीन आसान चरण',
    step1t: 'स्कूल जुड़ता है', step1d: 'एडमिन छात्रों की सूची अपलोड करता है',
    step2t: 'छात्र सीखते हैं', step2d: 'पाठ देखें, लैब चलाएं, बैज कमाएं',
    step3t: 'प्रमाणपत्र पाएं', step3d: '60%+ अंक पर डिजिटल प्रमाणपत्र मिलता है',
    ctaTitle: 'SimuLearning अपने स्कूल में लाएं',
    ctaSub: 'छात्र अपने स्कूल के माध्यम से इस प्लेटफॉर्म का उपयोग करते हैं।',
    onboardSchool: 'स्कूल जोड़ें →',
    statsStudents: 'छात्र', statsCourses: 'कोर्स', statsSchools: 'स्कूल', statsCerts: 'प्रमाणपत्र',
    by: 'SimuSoft Technologies द्वारा',
    features: [
      { icon: '🔬', title: 'वर्चुअल IoT लैब', desc: 'ब्राउज़र में ही LED जलाएं, सेंसर पढ़ें, मोटर चलाएं।' },
      { icon: '🏆', title: 'गेमिफाइड प्रगति', desc: 'XP कमाएं, बैज अनलॉक करें, स्ट्रीक बनाएं।' },
      { icon: '📜', title: 'सत्यापित प्रमाणपत्र', desc: 'QR कोड के साथ डिजिटल प्रमाणपत्र प्राप्त करें।' },
      { icon: '🧠', title: 'स्मार्ट क्विज़', desc: 'तुरंत ग्रेड किए गए MCQ प्रश्न।' },
      { icon: '📊', title: 'एनालिटिक्स', desc: 'शिक्षकों के लिए लाइव क्लास डैशबोर्ड।' },
      { icon: '🌐', title: '3 भाषाएं', desc: 'अंग्रेजी, हिंदी और मराठी में पूर्ण सामग्री।' },
    ],
  },
  mr: {
    tagline: 'K-12 AI आणि IoT शिक्षण व्यासपीठ',
    hero1: 'AI & IoT शिका',
    hero2: 'इयत्ता 1 ते 12',
    heroSub: 'व्हर्च्युअल IoT लॅब, स्मार्ट क्विझ, गेमिफाइड बॅजेस आणि प्रमाणित सर्टिफिकेट्स — प्रत्येक भारतीय शाळेतील विद्यार्थ्यासाठी.',
    exploreCourses: 'अभ्यासक्रम पहा →',
    schoolLogin: 'शाळा लॉगिन',
    studentLogin: 'विद्यार्थी लॉगिन',
    featTitle: 'विद्यार्थ्याला हवे ते सर्व',
    featSub: 'एक व्यासपीठ, संपूर्ण शिक्षण प्रवास',
    howTitle: 'हे कसे काम करते',
    howSub: 'शाळेपासून प्रमाणपत्रापर्यंत तीन सोपे टप्पे',
    step1t: 'शाळा सामील होते', step1d: 'प्रशासक विद्यार्थी यादी अपलोड करतो',
    step2t: 'विद्यार्थी शिकतात', step2d: 'धडे पहा, लॅब चालवा, बॅज मिळवा',
    step3t: 'सर्टिफिकेट मिळवा', step3d: '60%+ गुणांवर डिजिटल सर्टिफिकेट मिळते',
    ctaTitle: 'SimuLearning तुमच्या शाळेत आणा',
    ctaSub: 'विद्यार्थी त्यांच्या शाळेद्वारे या व्यासपीठाचा वापर करतात.',
    onboardSchool: 'शाळा जोडा →',
    statsStudents: 'विद्यार्थी', statsCourses: 'अभ्यासक्रम', statsSchools: 'शाळा', statsCerts: 'प्रमाणपत्रे',
    by: 'SimuSoft Technologies द्वारे',
    features: [
      { icon: '🔬', title: 'व्हर्च्युअल IoT लॅब', desc: 'ब्राउझरमध्येच LED जाळा, सेन्सर वाचा.' },
      { icon: '🏆', title: 'गेमिफाइड प्रगती', desc: 'XP मिळवा, बॅज अनलॉक करा, स्ट्रीक तयार करा.' },
      { icon: '📜', title: 'प्रमाणित सर्टिफिकेट', desc: 'QR कोडसह डिजिटल सर्टिफिकेट मिळवा.' },
      { icon: '🧠', title: 'स्मार्ट क्विझ', desc: 'त्वरित ग्रेड केलेले MCQ प्रश्न.' },
      { icon: '📊', title: 'विश्लेषण', desc: 'शिक्षकांसाठी लाइव्ह क्लास डॅशबोर्ड.' },
      { icon: '🌐', title: '3 भाषा', desc: 'इंग्रजी, हिंदी आणि मराठीत संपूर्ण सामग्री.' },
    ],
  },
};

type Locale = 'en' | 'hi' | 'mr';

// Use the shared Logo component

const IoTHeroIllustration = () => (
  <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 520 }}>
    <rect x="60" y="80" width="380" height="220" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5"/>
    <rect x="80" y="100" width="340" height="180" rx="8" fill="#0F172A"/>
    <rect x="100" y="120" width="140" height="80" rx="6" fill="#1E293B" stroke="#1A73E8" strokeWidth="1"/>
    <text x="170" y="155" textAnchor="middle" fill="#1A73E8" fontSize="10" fontFamily="monospace">Arduino IDE</text>
    <text x="170" y="172" textAnchor="middle" fill="#00C896" fontSize="9" fontFamily="monospace">void loop() {'{'}</text>
    <text x="170" y="187" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">  blink(LED);</text>
    <text x="170" y="202" textAnchor="middle" fill="#00C896" fontSize="9" fontFamily="monospace">{'}'}</text>
    <rect x="260" y="120" width="140" height="80" rx="6" fill="#1E293B" stroke="#00C896" strokeWidth="1"/>
    <circle cx="290" cy="145" r="12" fill="#00C896" opacity="0.2"/>
    <circle cx="290" cy="145" r="6" fill="#00C896"/>
    <text x="325" y="149" fill="#E2E8F0" fontSize="9" fontFamily="monospace">LED ON</text>
    <rect x="265" y="165" width="60" height="8" rx="4" fill="#334155"/>
    <rect x="265" y="165" width="42" height="8" rx="4" fill="#1A73E8"/>
    <text x="335" y="173" fill="#94A3B8" fontSize="8" fontFamily="monospace">70%</text>
    <rect x="265" y="180" width="60" height="8" rx="4" fill="#334155"/>
    <rect x="265" y="180" width="28" height="8" rx="4" fill="#A855F7"/>
    <text x="335" y="188" fill="#94A3B8" fontSize="8" fontFamily="monospace">46%</text>
    <rect x="100" y="215" width="300" height="50" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1"/>
    <circle cx="125" cy="240" r="8" fill="#00C896" opacity="0.2"/>
    <circle cx="125" cy="240" r="4" fill="#00C896"/>
    <circle cx="155" cy="240" r="8" fill="#1A73E8" opacity="0.2"/>
    <circle cx="155" cy="240" r="4" fill="#1A73E8"/>
    <circle cx="185" cy="240" r="8" fill="#A855F7" opacity="0.2"/>
    <circle cx="185" cy="240" r="4" fill="#A855F7"/>
    <text x="210" y="235" fill="#94A3B8" fontSize="8" fontFamily="monospace">Temperature: 28°C</text>
    <text x="210" y="248" fill="#94A3B8" fontSize="8" fontFamily="monospace">Humidity: 65%</text>
    <line x1="240" y1="300" x2="240" y2="340" stroke="#334155" strokeWidth="2"/>
    <rect x="200" y="340" width="80" height="15" rx="3" fill="#1E293B" stroke="#334155"/>
    <rect x="30" y="140" width="20" height="50" rx="4" fill="#1E293B" stroke="#334155"/>
    <rect x="450" y="140" width="20" height="50" rx="4" fill="#1E293B" stroke="#334155"/>
    <circle cx="15" cy="130" r="12" fill="#1A73E8" opacity="0.15"/>
    <circle cx="15" cy="130" r="6" fill="#1A73E8" opacity="0.6"/>
    <circle cx="15" cy="130" r="3" fill="#1A73E8"/>
    <circle cx="485" cy="130" r="12" fill="#00C896" opacity="0.15"/>
    <circle cx="485" cy="130" r="6" fill="#00C896" opacity="0.6"/>
    <circle cx="485" cy="130" r="3" fill="#00C896"/>
    <circle cx="15" cy="130" r="18" fill="none" stroke="#1A73E8" strokeWidth="1" opacity="0.3">
      <animate attributeName="r" from="12" to="22" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="485" cy="130" r="18" fill="none" stroke="#00C896" strokeWidth="1" opacity="0.3">
      <animate attributeName="r" from="12" to="22" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.3" to="0" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <rect x="340" y="30" width="100" height="36" rx="8" fill="#1A73E8"/>
    <text x="390" y="48" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">✓ Quiz Passed</text>
    <text x="390" y="60" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontFamily="sans-serif">Score: 92%</text>
    <rect x="60" y="30" width="110" height="36" rx="8" fill="#1E293B" stroke="#00C896"/>
    <text x="115" y="48" textAnchor="middle" fill="#00C896" fontSize="9" fontWeight="bold" fontFamily="sans-serif">🏆 Badge Earned</text>
    <text x="115" y="60" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">IoT Explorer</text>
  </svg>
);

const GradesIllustration = () => (
  <svg viewBox="0 0 460 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
    {[1,2,3,4,5,6,7,8,9,10,11,12].map((g, i) => {
      const x = 20 + (i % 6) * 72;
      const y = i < 6 ? 20 : 110;
      const colors = ['#1A73E8','#1A73E8','#1A73E8','#1A73E8','#00C896','#00C896','#00C896','#00C896','#A855F7','#A855F7','#A855F7','#A855F7'];
      const c = colors[i];
      return (
        <g key={g}>
          <rect x={x} y={y} width="60" height="60" rx="10" fill={c} opacity="0.12"/>
          <rect x={x} y={y} width="60" height="60" rx="10" fill="none" stroke={c} strokeWidth="1.5"/>
          <text x={x+30} y={y+25} textAnchor="middle" fill={c} fontSize="11" fontWeight="700" fontFamily="sans-serif">Gr {g}</text>
          <text x={x+30} y={y+42} textAnchor="middle" fill={c} fontSize="8" fontFamily="sans-serif" opacity="0.8">
            {g <= 4 ? 'Basics' : g <= 8 ? 'Arduino' : 'IoT Pro'}
          </text>
        </g>
      );
    })}
  </svg>
);

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [count, setCount] = useState({ students: 0, courses: 0, schools: 0, certs: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('simulearning_locale') as Locale;
    if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved);
  }, []);

  useEffect(() => {
    const targets = { students: 12400, courses: 48, schools: 38, certs: 8900 };
    if (!statsVisible) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        students: Math.floor(targets.students * ease),
        courses: Math.floor(targets.courses * ease),
        schools: Math.floor(targets.schools * ease),
        certs: Math.floor(targets.certs * ease),
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [statsVisible]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const t = T[locale];
  const isDevanagari = locale !== 'en';
  const switchLocale = (l: Locale) => { setLocale(l); localStorage.setItem('simulearning_locale', l); };

  const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : `${n}+`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #F0FDFE 100%)', padding: 'clamp(4rem,8vw,7rem) 2rem', position: 'relative', overflow: 'hidden' }}>
        <DottedSurface />
        {/* glow orbs */}
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="animate-fadeUp" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.35)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: '1.5rem', display: 'inline-flex' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00BCD4', display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#67E8F9', fontFamily: 'DM Sans' }}>{t.tagline}</span>
            </div>
            <h1 className={`animate-fadeUp delay-100 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(3rem,5.5vw,4.5rem)', color: '#1E3A5F', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              {t.hero1}
            </h1>
            <h1 className={`animate-fadeUp delay-200 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,5vw,3.5rem)', background: 'linear-gradient(135deg, #00BCD4, #4DD0E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              {t.hero2}
            </h1>
            <p className={`animate-fadeUp delay-300 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'rgba(13,27,46,0.6)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 580, fontFamily: 'DM Sans' }}>
              {t.heroSub}
            </p>
            <div className="animate-fadeUp delay-400" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <Link href="/courses" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.8rem 1.75rem' }}>{t.exploreCourses}</Link>
              <Link href="/admin-login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.75rem', background: 'rgba(15,23,42,0.04)', color: '#0F172A', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 'var(--radius-full)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(15,23,42,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(15,23,42,0.04)'; }}>
                {t.schoolLogin} →
              </Link>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <SimuRobot width={400} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ background: 'var(--navy)', padding: '2.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
          {[
            { label: t.statsStudents, value: fmtNum(count.students), color: '#60A5FA' },
            { label: t.statsCourses, value: `${count.courses}+`, color: '#34D399' },
            { label: t.statsSchools, value: `${count.schools}+`, color: '#C084FC' },
            { label: t.statsCerts, value: fmtNum(count.certs), color: '#60A5FA' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 6, fontFamily: 'DM Sans' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(4rem,7vw,6rem) 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{t.featTitle}</h2>
            <p className={isDevanagari ? 'lang-hi' : ''} style={{ color: 'var(--text3)', fontSize: '1.05rem', fontFamily: 'DM Sans' }}>{t.featSub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {t.features.map((f, i) => (
              <div key={i} className="card-hover animate-popIn" style={{ animationDelay: `${i * 0.08}s`, background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: i % 3 === 0 ? 'var(--primary-light)' : i % 3 === 1 ? 'var(--secondary-light)' : 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 className={isDevanagari ? 'lang-hi' : ''} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem' }}>{f.title}</h3>
                  <p className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.6, fontFamily: 'DM Sans' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADE MAP ── */}
      <section style={{ background: 'var(--card)', padding: 'clamp(4rem,7vw,6rem) 2rem', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              {locale === 'en' ? 'Built for Every Grade' : locale === 'hi' ? 'हर कक्षा के लिए बना' : 'प्रत्येक इयत्तेसाठी'}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
              {[['#1A73E8', 'Gr 1–4: Basics'], ['#00C896', 'Gr 5–8: Arduino'], ['#A855F7', 'Gr 9–12: IoT Pro']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text3)', fontFamily: 'DM Sans' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <GradesIllustration />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: 'clamp(4rem,7vw,6rem) 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{t.howTitle}</h2>
            <p className={isDevanagari ? 'lang-hi' : ''} style={{ color: 'var(--text3)', fontSize: '1.05rem', fontFamily: 'DM Sans' }}>{t.howSub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', title: t.step1t, desc: t.step1d, icon: '🏫', color: '#1A73E8' },
              { num: '02', title: t.step2t, desc: t.step2d, icon: '💡', color: '#00C896' },
              { num: '03', title: t.step3t, desc: t.step3d, icon: '🏆', color: '#A855F7' },
            ].map((step, i) => (
              <div key={i} className="card-hover animate-popIn" style={{ animationDelay: `${i * 0.15}s`, background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: '2.5rem', color: step.color, opacity: 0.15, lineHeight: 1, marginBottom: '0.5rem' }}>{step.num}</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{step.icon}</div>
                <h3 className={isDevanagari ? 'lang-hi' : ''} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p className={isDevanagari ? 'lang-hi' : ''} style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6, fontFamily: 'DM Sans' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #0D1B2E 0%, #0F172A 100%)', padding: 'clamp(4rem,7vw,6rem) 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,115,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,115,232,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(26,115,232,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 className={`animate-fadeUp ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{t.ctaTitle}</h2>
          <p className={`animate-fadeUp delay-100 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2rem', fontFamily: 'DM Sans' }}>{t.ctaSub}</p>
          <div className="animate-fadeUp delay-200" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admin-login" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}>{t.onboardSchool}</Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.85rem 2rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.95rem' }}>{t.studentLogin}</Link>
          </div>
          <p className="animate-fadeUp delay-300" style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans' }}>
            {locale === 'en' ? 'Already a student? Ask your school administrator for access.' : locale === 'hi' ? 'क्या आप छात्र हैं? अपने स्कूल प्रशासक से संपर्क करें।' : 'आधीच विद्यार्थी आहात? शाळेच्या प्रशासकाशी संपर्क करा.'}
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#070D16', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo width={48} />
            <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>SimuLearning · {t.by}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['en', 'hi', 'mr'] as Locale[]).map(l => (
              <button key={l} onClick={() => switchLocale(l)} style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', border: `1px solid ${locale === l ? 'rgba(26,115,232,0.5)' : 'rgba(255,255,255,0.1)'}`, background: locale === l ? 'rgba(26,115,232,0.15)' : 'transparent', color: locale === l ? '#93C5FD' : 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: l !== 'en' ? 'Noto Sans Devanagari' : 'DM Sans' }}>
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[['Courses', '/courses'], ['Student Login', '/login'], ['School Login', '/admin-login']].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
