'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getUser, logout } from './lib/auth';
type Locale = 'en' | 'hi' | 'mr';
const T: Record<Locale, Record<string, string>> = {
  en: {
    nav_explore: 'Explore Courses',
    nav_admin: 'Admin Panel',
    hero_badge: '🚀 K-12 AI & IoT Learning Platform',
    hero_title: 'Learn Smarter with SimuLearning',
    hero_sub: 'Interactive simulations, quizzes, and certificates for school students across India.',
    hero_cta: 'Explore Courses',
    hero_admin: 'Admin Panel',
    stats_students: 'Students',
    stats_courses: 'Courses',
    stats_schools: 'Schools',
    stats_certs: 'Certificates',
    topics_title: 'What You\'ll Learn',
    features_title: 'Built for Indian Schools',
    cta_title: 'Ready to Start Learning?',
    cta_sub: 'Join students across India mastering AI & IoT.',
    cta_btn: 'Get Started Free',
    footer_copy: 'SimuLearning — AI & IoT Education for Indian Schools 🇮🇳',
  },
  hi: {
    nav_explore: 'कोर्स देखें',
    nav_admin: 'एडमिन',
    hero_badge: '🚀 K-12 AI और IoT शिक्षा प्लेटफ़ॉर्म',
    hero_title: 'SimuLearning के साथ स्मार्ट सीखें',
    hero_sub: 'स्कूली छात्रों के लिए इंटरेक्टिव सिमुलेशन, क्विज़ और सर्टिफ़िकेट।',
    hero_cta: 'कोर्स देखें',
    hero_admin: 'एडमिन पैनल',
    stats_students: 'छात्र',
    stats_courses: 'कोर्स',
    stats_schools: 'स्कूल',
    stats_certs: 'सर्टिफ़िकेट',
    topics_title: 'क्या सीखेंगे',
    features_title: 'भारतीय स्कूलों के लिए बना',
    cta_title: 'सीखना शुरू करें?',
    cta_sub: 'भारत भर के छात्रों के साथ AI और IoT सीखें।',
    cta_btn: 'मुफ़्त शुरू करें',
    footer_copy: 'SimuLearning — भारतीय स्कूलों के लिए AI और IoT शिक्षा 🇮🇳',
  },
  mr: {
    nav_explore: 'कोर्स पहा',
    nav_admin: 'प्रशासक',
    hero_badge: '🚀 K-12 AI आणि IoT शिक्षण व्यासपीठ',
    hero_title: 'SimuLearning सोबत हुशारीने शिका',
    hero_sub: 'शालेय विद्यार्थ्यांसाठी इंटरॅक्टिव सिम्युलेशन, क्विझ आणि प्रमाणपत्रे.',
    hero_cta: 'कोर्स पहा',
    hero_admin: 'प्रशासक पॅनेल',
    stats_students: 'विद्यार्थी',
    stats_courses: 'कोर्स',
    stats_schools: 'शाळा',
    stats_certs: 'प्रमाणपत्रे',
    topics_title: 'काय शिकाल',
    features_title: 'भारतीय शाळांसाठी बनवले',
    cta_title: 'शिकण्यास सुरुवात करायची?',
    cta_sub: 'भारतभरातील विद्यार्थ्यांसह AI आणि IoT शिका.',
    cta_btn: 'मोफत सुरू करा',
    footer_copy: 'SimuLearning — भारतीय शाळांसाठी AI आणि IoT शिक्षण 🇮🇳',
  },
};

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [user, setUser] = useState<any>(null);
  const t = T[locale];

  useEffect(() => {
    const u = getUser(); setUser(u);
  }, []);

  const features = [
    { icon: '🧪', title: 'Interactive Simulations', desc: 'Hands-on virtual labs for AI and IoT concepts' },
    { icon: '🏆', title: 'Gamified Learning', desc: 'Earn badges and certificates as you progress' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Learn anywhere on any device' },
    { icon: '🇮🇳', title: 'Multilingual', desc: 'Content in English, Hindi and Marathi' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Detailed analytics for teachers and admins' },
    { icon: '🔒', title: 'Secure Platform', desc: 'School-grade security and data privacy' },
  ];

  const topics = [
    { icon: '🤖', label: 'Artificial Intelligence' },
    { icon: '📡', label: 'IoT & Sensors' },
    { icon: '🔌', label: 'Arduino & ESP32' },
    { icon: '🏭', label: 'Industrial IoT' },
    { icon: '💡', label: 'Smart Systems' },
    { icon: '📟', label: 'Embedded Systems' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: 'var(--bg, #fafafa)', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1A73E8,#00C896)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🚀</div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A73E8' }}>SimuLearning</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/courses" style={{ padding: '0.5rem 1rem', borderRadius: 8, color: '#374151', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{t.nav_explore}</Link>
          {user?.role === 'admin' || user?.role === 'super_admin' ? (
            <Link href="/admin" style={{ padding: '0.5rem 1rem', borderRadius: 8, color: '#374151', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{t.nav_admin}</Link>
          ) : null}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['en','hi','mr'] as Locale[]).map(l => (
              <button key={l} onClick={() => setLocale(l)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: locale === l ? '#EFF6FF' : 'transparent', color: locale === l ? '#1A73E8' : '#6b7280' }}>
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
              </button>
            ))}
          </div>
          {user ? (
            <button onClick={() => { logout(); setUser(null); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Logout</button>
          ) : (
            <Link href="/login" style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: '#1A73E8', color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#DBEAFE', color: '#1D4ED8', padding: '0.4rem 1.2rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.hero_badge}</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#111827', marginBottom: '1rem', lineHeight: 1.15 }}>{t.hero_title}</h1>
        <p style={{ fontSize: '1.15rem', color: '#6B7280', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>{t.hero_sub}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/courses" style={{ padding: '0.9rem 2rem', borderRadius: 12, background: '#1A73E8', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>{t.hero_cta} →</Link>
          <Link href="/login" style={{ padding: '0.9rem 2rem', borderRadius: 12, background: '#fff', color: '#1A73E8', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', border: '2px solid #1A73E8' }}>Sign In</Link>
        </div>
      </section>

      {/* Topics */}
      <section style={{ padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem', color: '#111827' }}>{t.topics_title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {topics.map(topic => (
            <div key={topic.label} style={{ background: '#fff', borderRadius: 16, padding: '1.5rem 1rem', textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{topic.icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>{topic.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 2rem', background: '#F9FAFB' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem', color: '#111827' }}>{t.features_title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: '#111827' }}>{f.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #1A73E8, #00C896)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>{t.cta_title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1.05rem' }}>{t.cta_sub}</p>
        <Link href="/register" style={{ padding: '1rem 2.5rem', borderRadius: 12, background: '#fff', color: '#1A73E8', textDecoration: 'none', fontWeight: 800, fontSize: '1rem' }}>{t.cta_btn}</Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem', borderTop: '1px solid #e5e7eb' }}>
        {t.footer_copy}
      </footer>
    </div>
  );
}
