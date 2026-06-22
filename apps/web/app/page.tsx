'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import SimuRobot from '@/components/ui/simu-robot';
import { div } from 'three/src/nodes/math/OperatorNode.js';
type Locale = 'en' | 'hi' | 'mr';

const T = {
  en: {
    tagline: 'K-12 AI & IoT Learning Platform',
    heroTitle: "India's First AI-IoT Learning Platform",
    heroSub:
      'Empowering Future Innovators Through AI, Robotics & Smart Learning',
    aboutBtn: 'About LMS →',
    exploreCourses: 'Explore Courses',
    schoolLogin: 'School Login',
    studentLogin: 'Student Login',
    sectionTitle: 'Complete Digital Learning For Schools',
    sectionDesc:
      'SimuLearning helps schools deliver practical technology education with real labs, simulations, progress tracking and certificates.',
    productTitle: 'Learning Modules',
    productSub: 'Everything students need in one modern LMS platform.',
    roadmapTitle: 'Grade-Wise Learning Path',
    roadmapSub: 'From basic digital learning to advanced robotics and IoT projects.',
    ctaTitle: 'Bring SimuLearning To Your School',
    ctaSub:
      'Give students a professional, practical and future-ready learning experience.',
    onboardSchool: 'Onboard Your School',
    by: 'by SimuSoft Technologies',
    statsStudents: 'Students',
    statsCourses: 'Courses',
    statsSchools: 'Schools',
    statsCerts: 'Certificates',
    modules: [
      ['🤖', 'Robotics Learning', 'Learn automation, machines, robots and smart systems.'],
      ['🔬', 'Virtual IoT Learning', 'Practice circuits, sensors and IoT experiments online.'],
      ['💻', 'Digital Classroom', 'Access lessons, quizzes and learning activities easily.'],
      ['🏆', 'Gamified Progress', 'Earn badges, XP, streaks and learning achievements.'],
      ['📊', 'School Analytics', 'Track student progress, completion and performance.'],
      ['📜', 'Certificates', 'Issue verified certificates after course completion.'],
    ],
  },
  hi: {
    tagline: 'K-12 AI और IoT शिक्षण मंच',
    heroTitle: 'भारत का पहला AI और IoT लर्निंग प्लेटफ़ॉर्म',
    heroSub:
      'AI, रोबोटिक्स और स्मार्ट लर्निंग के ज़रिए भविष्य के इनोवेटर्स को सशक्त बनाना',
    aboutBtn: 'LMS के बारे में →',
    viewCourses: 'सभी कोर्स देखें',
    exploreCourses: 'कोर्स देखें',
    schoolLogin: 'स्कूल लॉगिन',
    studentLogin: 'छात्र लॉगिन',
    sectionTitle: 'स्कूलों के लिए पूर्ण डिजिटल लर्निंग',
    sectionDesc:
      'SimuLearning स्कूलों को वास्तविक लैब, सिमुलेशन, प्रगति ट्रैकिंग और प्रमाणपत्रों के साथ तकनीकी शिक्षा देने में मदद करता है।',
    productTitle: 'लर्निंग मॉड्यूल',
    productSub: 'छात्रों के लिए एक आधुनिक LMS प्लेटफॉर्म में सब कुछ।',
    roadmapTitle: 'कक्षा अनुसार लर्निंग पाथ',
    roadmapSub: 'बेसिक डिजिटल लर्निंग से एडवांस रोबोटिक्स और IoT प्रोजेक्ट्स तक।',
    ctaTitle: 'SimuLearning अपने स्कूल में लाएं',
    ctaSub:
      'छात्रों को प्रोफेशनल, प्रैक्टिकल और फ्यूचर-रेडी लर्निंग अनुभव दें।',
    onboardSchool: 'स्कूल ऑनबोर्ड करें',
    by: 'SimuSoft Technologies द्वारा',
    statsStudents: 'छात्र',
    statsCourses: 'कोर्स',
    statsSchools: 'स्कूल',
    statsCerts: 'प्रमाणपत्र',
    modules: [
      ['🤖', 'रोबोटिक्स लर्निंग', 'ऑटोमेशन, मशीन, रोबोट और स्मार्ट सिस्टम सीखें।'],
      ['🔬', 'वर्चुअल IoT लर्निंग', 'सर्किट, सेंसर और IoT प्रयोग ऑनलाइन करें।'],
      ['💻', 'डिजिटल क्लासरूम', 'लेसन, क्विज़ और गतिविधियां आसानी से एक्सेस करें।'],
      ['🏆', 'गेमिफाइड प्रगति', 'बैज, XP, स्ट्रीक और अचीवमेंट प्राप्त करें।'],
      ['📊', 'स्कूल एनालिटिक्स', 'छात्र प्रगति, कंप्लीशन और प्रदर्शन ट्रैक करें।'],
      ['📜', 'प्रमाणपत्र', 'कोर्स पूरा होने पर प्रमाणित सर्टिफिकेट दें।'],
    ],
  },
  mr: {
    tagline: 'K-12 AI आणि IoT शिक्षण व्यासपीठ',
    heroTitle: 'भारताचे पहिले AI आणि IoT शिक्षण व्यासपीठ',
    heroSub:
      'AI, रोबोटिक्स आणि स्मार्ट लर्निंगद्वारे भविष्यातील नवोन्मेषकांना सक्षम करणे',
    aboutBtn: 'LMS बद्दल →',
    viewCourses: 'सर्व अभ्यासक्रम पहा',
    exploreCourses: 'अभ्यासक्रम पहा',
    schoolLogin: 'शाळा लॉगिन',
    studentLogin: 'विद्यार्थी लॉगिन',
    sectionTitle: 'शाळांसाठी पूर्ण डिजिटल लर्निंग',
    sectionDesc:
      'SimuLearning शाळांना वास्तविक लॅब, सिम्युलेशन, प्रगती ट्रॅकिंग आणि प्रमाणपत्रांसह तांत्रिक शिक्षण देण्यास मदत करते.',
    productTitle: 'लर्निंग मॉड्यूल्स',
    productSub: 'विद्यार्थ्यांसाठी एका आधुनिक LMS प्लॅटफॉर्ममध्ये सर्व काही.',
    roadmapTitle: 'इयत्ता अनुसार लर्निंग पाथ',
    roadmapSub: 'बेसिक डिजिटल लर्निंगपासून अ‍ॅडव्हान्स रोबोटिक्स आणि IoT प्रोजेक्ट्सपर्यंत.',
    ctaTitle: 'SimuLearning तुमच्या शाळेत आणा',
    ctaSub:
      'विद्यार्थ्यांना प्रोफेशनल, प्रॅक्टिकल आणि फ्यूचर-रेडी लर्निंग अनुभव द्या.',
    onboardSchool: 'शाळा ऑनबोर्ड करा',
    by: 'SimuSoft Technologies द्वारे',
    statsStudents: 'विद्यार्थी',
    statsCourses: 'अभ्यासक्रम',
    statsSchools: 'शाळा',
    statsCerts: 'प्रमाणपत्रे',
    modules: [
      ['🤖', 'रोबोटिक्स लर्निंग', 'ऑटोमेशन, मशीन, रोबोट आणि स्मार्ट सिस्टम शिका।'],
      ['🔬', 'व्हर्च्युअल IoT लर्निंग', 'सर्किट, सेन्सर आणि IoT प्रयोग ऑनलाइन करा।'],
      ['💻', 'डिजिटल क्लासरूम', 'लेसन, क्विझ आणि अ‍ॅक्टिव्हिटी सहज वापरा।'],
      ['🏆', 'गेमिफाइड प्रगती', 'बॅजेस, XP, स्ट्रीक्स आणि अचीवमेंट मिळवा।'],
      ['📊', 'शाळा अ‍ॅनालिटिक्स', 'विद्यार्थी प्रगती आणि परफॉर्मन्स ट्रॅक करा।'],
      ['📜', 'प्रमाणपत्रे', 'कोर्स पूर्ण झाल्यावर प्रमाणित सर्टिफिकेट द्या।'],
    ],
  },
} as const;

const PHOTOS = {
  hero:
    '',
  about:
    'images/home/about1.png',
  classroom:
    '',
  lab:
    'images/home/about2.png',
};

const MARQUEE_IMAGES = [
  {
    src: 'images/home/S1.JPG',
    alt: 'Students learning robotics in lab',
  },
  {
    src: 'images/home/S2.jpg',
    alt: 'Students learning together',
  },
  {
    src: 'images/home/S3.png',
    alt: 'Students using laptops',
  },
  {
    src: 'images/home/S4.png',
    alt: 'Electronics and technology lab',
  },
  {
    src: 'images/home/S5.jpg',
    alt: 'School classroom learning', 
  },
  {
    src: 'images/home/S6.png',
    alt: 'Students reading and learning',
  },
] as const;

function ContinuousImageSlider() {
  const repeatedImages = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

  return (
    <section className="ss-marquee-section">
      <div className="ss-marquee-header">
        <h1 className="ss-primary">Learning Moments</h1>
        <h2>Smart Classrooms, Robotics Labs & Digital Learning</h2>
      </div>

      <div className="ss-image-marquee">
        <div className="ss-image-track">
          {repeatedImages.map((image, index) => (
            <div className="ss-marquee-card" key={`${image.src}-${index}`}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// function ChatButton() {
//   return (
//     <button className="ss-chat" aria-label="Chat support">
//       <span>💬</span>
//     </button>
//   );
// }

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [count, setCount] = useState({
    students: 0,
    courses: 0,
    schools: 0,
    certs: 0,
  });

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('simulearning_locale') as Locale;

    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      setLocale(saved);
    }

    const handler = (e: CustomEvent) => setLocale(e.detail as Locale);

    window.addEventListener('simu:locale-changed', handler as EventListener);

    return () => {
      window.removeEventListener('simu:locale-changed', handler as EventListener);
    };
  }, []);

  useEffect(() => {
    const element = statsRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;

    const targets = {
      students: 400000,
      courses: 48,
      schools: 600,
      certs: 89000,
    };

    const duration = 1500;
    const start = Date.now();

    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
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

  const t = T[locale];
  const isDevanagari = locale !== 'en';

  const switchLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem('simulearning_locale', l);
  };

  const fmtNum = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : `${n}+`);

  return (
    <main className="ss-page">
      <style>{`
        .ss-page,
        .ss-page * {
          box-sizing: border-box;
        }

        .ss-page {
          min-height: 100vh;
          overflow-x: hidden;
          color: #182235;
          background: #ffffff;
          font-family: DM Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .ss-container {
          width: min(1160px, calc(100% - 2rem));
          margin: 0 auto;
        }

        .ss-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
        }

        .ss-nav-inner {
          width: 100%;
          min-height: 84px;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .ss-brand {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: inherit;
          text-decoration: none;
        }

        .ss-logo {
          width: 172px;
          display: flex;
          align-items: center;
        }

        .ss-brand-line {
          width: 1px;
          height: 52px;
          background: #dbe3ee;
        }

        .ss-brand strong {
          display: block;
          font-family: Plus Jakarta Sans, sans-serif;
          font-size: 1.28rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          color: #111827;
        }

        .ss-brand span {
          color: #6b7280;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .ss-nav-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .ss-nav-link,
        .ss-lang {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 0.58rem 0.9rem;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #1f2937;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 900;
          cursor: pointer;
          transition: 160ms ease;
        }

        .ss-nav-link:hover,
        .ss-lang:hover {
          color: #ffffff;
          background: #3b42dc;
          border-color: #3b42dc;
          transform: translateY(-1px);
        }

        .ss-lang.active {
          color: #ffffff;
          background: #3b42dc;
          border-color: #3b42dc;
        }

        .ss-hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 84px;
  overflow: hidden;
  background: #07111f;
}

.ss-hero-video {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ss-hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(10, 20, 35, 0.82) 0%, rgba(10, 20, 35, 0.52) 4%, rgba(10, 20, 35, 0.14) 100%);
}

        .ss-hero-content {
  width: min(1320px, calc(100% - 2rem));
  margin: 0 auto;
  position: relative;
  z-index: 8;
  display: grid;
  grid-template-columns: minmax(720px, 1fr) minmax(300px, 390px);
  align-items: center;
  gap: 2rem;
}

        .ss-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          width: fit-content;
          margin-bottom: 1.2rem;
          padding: 0.48rem 0.75rem;
          border-radius: 8px;
          color: #ffffff;
          background: rgba(59, 66, 220, 0.88);
          font-size: 0.82rem;
          font-weight: 900;
        }

        .ss-badge i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.18);
        }

        .ss-hero h1 {
          max-width: 760px;
          margin: 0;
          color: #ffffff;
          font-family: Plus Jakarta Sans, sans-serif;
          font-size: clamp(2.45rem, 4.0vw, 4.4rem);
          line-height: 1.2;
          font-weight: 580;
          text-shadow: 0 16px 36px rgba(0,0,0,0.25);
        }

        .ss-hero p {
          max-width: 650px;
          margin: 1rem 0 0;
          color: rgba(255,255,255,0.9);
          font-size: clamp(1rem, 1.65vw, 1.15rem);
          line-height: 1.75;
          font-weight: 700;
        }

        .ss-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.9rem;
          margin-top: 1.8rem;
        }

        .ss-primary,
        .ss-secondary {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 1.35rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 950;
          transition: 160ms ease;
          margin-bottom: 1.0rem;
        }

        .ss-primary {
          color: #ffffff;
          background: #3b42dc;
          box-shadow: 0 18px 36px rgba(59,66,220,0.35);
        }

        .ss-secondary {
          color: #ffffff;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.5);
          backdrop-filter: blur(12px);
        }

        .ss-primary:hover,
        .ss-secondary:hover {
          transform: translateY(-3px);

        }

        .ss-hero-panel {
          min-height: 470px;
          position: relative;
        }

        .ss-marquee-section {
          overflow: hidden;
          padding: 3rem 0;
          background: #ffffff;
          border-bottom: 1px solid #eef2f7;
        }

        .ss-marquee-header {
          width: min(1160px, calc(100% - 2rem));
          margin: 0 auto 1.5rem;
          text-align: center;
          
        }

        .ss-marquee-header span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.65rem;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          background: #eef2ff;
          color: #3b42dc;
          font-size: 0.78rem;
          font-weight: 950;
        }

        .ss-marquee-header h2 {
          margin: 0;
          color: #111827;
          font-family: Plus Jakarta Sans, sans-serif;
          
          line-height: 1.15;
          font-weight: 950;
          letter-spacing: 0.004em;
        }

        .ss-image-marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .ss-image-marquee::before,
        .ss-image-marquee::after {
          content: '';
          position: absolute;
          top: 0;
          z-index: 2;
          width: 120px;
          height: 100%;
          pointer-events: none;
        }

        .ss-image-marquee::before {
          left: 0;
          background: linear-gradient(90deg, #ffffff, transparent);
        }

        .ss-image-marquee::after {
          right: 0;
          background: linear-gradient(270deg, #ffffff, transparent);
        }

        .ss-image-track {
          display: flex;
          width: max-content;
          gap: 1rem;
          animation: ssMarqueeMove 28s linear infinite;
        }

        .ss-image-marquee:hover .ss-image-track {
          animation-play-state: paused;
        }

        .ss-marquee-card {
          flex: 0 0 auto;
          width: 310px;
          height: 190px;
          overflow: hidden;
          border-radius: 18px;
          background: #e5e7eb;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.13);
        }

        .ss-marquee-card img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transform: scale(1.04);
          transition: transform 500ms ease, filter 500ms ease;
        }

        .ss-marquee-card:hover img {
          transform: scale(1.14);
          filter: saturate(1.15);
        }

        .ss-section {
          padding: clamp(4rem, 7vw, 6rem) 0;
          position: relative;
        }

        .ss-section.soft {
          background:
            linear-gradient(135deg, #ffffff 0%, #f7f8ff 100%);
        }

        .ss-about {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }


        .ss-association {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 8%, rgba(59, 66, 220, 0.08), transparent 34%),
    radial-gradient(circle at 90% 20%, rgba(34, 197, 94, 0.10), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
}

.ss-association-head {
  max-width: 820px;
  margin: 0 auto 2.4rem;
  text-align: center;
  margin-top: -3.9rem;
  margin-bottom: -0.4rem;
}

.ss-section-tag {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.9rem;
  padding: 0.48rem 0.95rem;
  border-radius: 999px;
  color: #285f37;
  background: rgba(34, 197, 94, 0.10);
  border: 1px solid rgba(34, 197, 94, 0.18);
  font-size: 0.78rem;
  font-weight: 950;
}
        
.ss-association-slider {
  position: relative;
  overflow: hidden;
  padding: 1rem 0;
}

.ss-association-slider::before,
.ss-association-slider::after {
  content: '';
  position: absolute;
  top: 0;
  z-index: 3;
  width: 110px;
  height: 100%;
  pointer-events: none;
}

.ss-association-slider::before {
  left: 0;
  background: linear-gradient(90deg, #ffffff, transparent);
}

.ss-association-slider::after {
  right: 0;
  background: linear-gradient(270deg, #ffffff, transparent);
}

.ss-association-track {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: max-content;
  animation: ssAssociationScroll 32s linear infinite;
}

.ss-association-slider:hover .ss-association-track {
  animation-play-state: paused;
}

.ss-association-card {
  width: 260px;
  height: 160px;
  flex: 0 0 260px;
  overflow: hidden;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.10);
  transition: 260ms ease
  
}

.ss-association-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 30px 76px rgba(15, 23, 42, 0.16);
}

/* For logos */
.ss-logo-card {
  padding: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ss-logo-card img {
  max-width: 100%;
  max-height: 105px;
  display: block;
  object-fit: contain;
  transition: transform 450ms ease, filter 450ms ease;
}

/* For normal school/activity images */
.ss-image-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.04);
  transition: transform 650ms ease, filter 650ms ease;
}

.ss-logo-card:hover img {
  transform: scale(1.08);
  filter: saturate(1.15);
}

.ss-image-card:hover img {
  transform: scale(1.14);
  filter: saturate(1.15);
}

@keyframes ssAssociationScroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

        .ss-about-media {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .ss-about-media img {
          width: 100%;
          height: 230px;
          display: block;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 22px 50px rgba(15,23,42,0.14);
          animation: ssPhotoFloat 5s ease-in-out infinite;
          transition:
            transform 240ms ease,
            box-shadow 240ms ease,
            filter 240ms ease;
        }

        .ss-about-media img:first-child {
          transform: translateY(2rem);
        }

        .ss-about-media img:nth-child(2) {
          animation-delay: 0.8s;
        }

        .ss-about-media img:hover {
          transform: translateY(-10px) scale(1.035);
          box-shadow: 0 32px 70px rgba(15,23,42,0.2);
          filter: saturate(1.12);
        }

        
        .ss-about-label {
          width: fit-content;
          margin-bottom: 1.2rem;
          color: #3b42dc;
          font-size: 0.95rem;
          font-weight: 950;
          letter-spacing: 0.02em;
        }

        .ss-heading {
          margin: 0 0 1rem;
          color: #111827;
          font-family: Plus Jakarta Sans, sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.1;
          font-weight: 950;
          letter-spacing: 0.001em;
        }

        .ss-desc {
          margin: 0;
          color: #667085;
          font-size: 1.02rem;
          line-height: 1.85;
          font-weight: 650;
        }

        .ss-center {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 3rem;
        }

        .ss-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.35rem;
}

.ss-module {
  overflow: hidden;
  padding: 1rem;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
  transition: 260ms ease;
  animation: ssModuleFloat 5s ease-in-out infinite;
}

.ss-module:nth-child(2),
.ss-module:nth-child(5) {
  animation-delay: 0.45s;
}

.ss-module:nth-child(3),
.ss-module:nth-child(6) {
  animation-delay: 0.9s;
}

.ss-module:hover {
  transform: translateY(-12px);
  box-shadow: 0 32px 76px rgba(15, 23, 42, 0.16);
  border-color: rgba(59, 66, 220, 0.28);
}

.ss-module-image {
  width: 100%;
  height: 185px;
  overflow: hidden;
  border-radius: 20px;
  background: #e5e7eb;
}

.ss-module-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.04);
  transition: transform 650ms ease, filter 650ms ease;
}

.ss-module:hover .ss-module-image img {
  transform: scale(1.14);
  filter: saturate(1.15);
}

.ss-module-content {
  padding: 1.25rem 0.45rem 0.45rem;
  text-align: center;
}

.ss-module h3 {
  margin: 0 0 0.6rem;
  color: #182235;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.45rem;
  line-height: 1.2;
  font-weight: 600;
}

.ss-module p {
  min-height: 74px;
  margin: 0 auto 1rem;
  color: #667085;
  font-size: 0.92rem;
  line-height: 1.65;
  font-weight: 650;
}


@keyframes ssModuleFloat {
  0%, 100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -8px;
  }
}
        .ss-premium-features {
  overflow: hidden;
  background:
    radial-gradient(circle at 8% 10%, rgba(59, 66, 220, 0.12), transparent 28%),
    radial-gradient(circle at 95% 20%, rgba(34, 197, 94, 0.1), transparent 26%),
    linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
}

.ss-premium-head {
  max-width: 820px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.ss-premium-tag {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.9rem;
  padding: 0.48rem 0.95rem;
  border-radius: 999px;
  color: #3b42dc;
  background: #eef2ff;
  border: 1px solid #dfe4ff;
  font-size: 0.78rem;
  font-weight: 950;
}

.ss-premium-tag.dark {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(255, 255, 255, 0.2);
}

.ss-premium-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 1.25rem;
  align-items: stretch;
}

.ss-premium-hero-card {
  position: relative;
  overflow: hidden;
  min-height: 520px;
  border-radius: 30px;
  background: #111827;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
}

.ss-premium-hero-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.05);
  animation: ssPremiumImageZoom 8s ease-in-out infinite;
}

.ss-premium-hero-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.18) 42%, rgba(15, 23, 42, 0.86) 100%);
}

.ss-premium-hero-content {
  position: absolute;
  left: 1.3rem;
  right: 1.3rem;
  bottom: 1.3rem;
  z-index: 2;
  padding: 1.3rem;
  border-radius: 22px;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(16px);
}

.ss-premium-hero-content span {
  display: block;
  margin-bottom: 0.45rem;
  color: #93c5fd;
  font-size: 0.78rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ss-premium-hero-content h3 {
  margin: 0 0 0.55rem;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.08;
  font-weight: 950;
}

.ss-premium-hero-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.98rem;
  line-height: 1.65;
  font-weight: 650;
}

.ss-premium-feature-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.ss-premium-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  min-height: 118px;
  padding: 1.2rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
  transition: 220ms ease;
  animation: ssPremiumCardFloat 5s ease-in-out infinite;
}

.ss-premium-card:nth-child(2) {
  animation-delay: 0.35s;
}

.ss-premium-card:nth-child(3) {
  animation-delay: 0.7s;
}

.ss-premium-card:nth-child(4) {
  animation-delay: 1.05s;
}

.ss-premium-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 66, 220, 0.35);
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.14);
}

.ss-premium-icon {
  width: 66px;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: linear-gradient(135deg, #eef2ff, #e0f2fe);
  font-size: 2rem;
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.1);
}

.ss-premium-card h3 {
  margin: 0 0 0.35rem;
  color: #111827;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: 1.15rem;
  font-weight: 950;
}

.ss-premium-card p {
  margin: 0;
  color: #667085;
  font-size: 0.94rem;
  line-height: 1.6;
  font-weight: 650;
}

.ss-learning-path {
  margin-top: 1.35rem;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 2rem;
  align-items: center;
  border-radius: 30px;
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.22), transparent 30%),
    linear-gradient(135deg, #0f172a, #1e293b 48%, #1d4ed8);
  box-shadow: 0 30px 85px rgba(15, 23, 42, 0.22);
}

.ss-learning-left h2 {
  margin: 0 0 1rem;
  color: #ffffff;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: clamp(1.85rem, 3.4vw, 3rem);
  line-height: 1.08;
  font-weight: 650;
  letter-spacing: 0.01em;
}

.ss-learning-left p {
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 1rem;
  line-height: 1.75;
  font-weight: 650;
}

.ss-subject-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.3rem;
}

.ss-subject-badges span {
  display: inline-flex;
  padding: 0.42rem 0.72rem;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.76rem;
  font-weight: 950;
}

.ss-learning-right {
  display: grid;
  gap: 1rem;
}

.ss-path-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  transition: 220ms ease;
  animation: ssPremiumPathMove 5s ease-in-out infinite;
}

.ss-path-card:nth-child(2) {
  animation-delay: 0.45s;
}

.ss-path-card:nth-child(3) {
  animation-delay: 0.9s;
}

.ss-path-card:hover {
  transform: translateX(-8px);
  background: rgba(255, 255, 255, 0.17);
}

.ss-path-circle {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: #111827;
  background: #ffffff;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: 1.12rem;
  font-weight: 950;
}

.ss-path-card h3 {
  margin: 0 0 0.4rem;
  color: #ffffff;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: 1.08rem;
  font-weight: 950;
}

.ss-path-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.9rem;
  line-height: 1.55;
  font-weight: 650;
}

@keyframes ssPremiumImageZoom {
  0%, 100% {
    transform: scale(1.05);
  }

  50% {
    transform: scale(1.14);
  }
}

@keyframes ssPremiumCardFloat {
  0%, 100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -7px;
  }
}

@keyframes ssPremiumPathMove {
  0%, 100% {
    translate: 0 0;
  }

  50% {
    translate: -6px 0;
  }
}

        .ss-stats {
          background:
            linear-gradient(90deg, rgba(15,23,42,0.92), rgba(15,23,42,0.72)),
            url(images/home/stat_bg.png);
          background-size: cover;
          background-position: center;
          padding: 4rem 0;
        }

        .ss-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .ss-stat {
          padding: 1.6rem 1rem;
          text-align: center;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
        }

        .ss-stat strong {
          display: block;
          color: #ffffff;
          font-family: Plus Jakarta Sans, sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          line-height: 1;
          font-weight: 950;
        }

        .ss-stat span {
          display: block;
          margin-top: 0.55rem;
          color: rgba(255,255,255,0.72);
          font-size: 0.9rem;
          font-weight: 850;
        }

        .ss-cta {
  padding: clamp(4rem, 7vw, 6rem) 0;
  background: linear-gradient(180deg, #ffffff 0%, #f4f7ff 100%);
  text-align: center;         
}

.ss-cta-box {
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(70, 40, 0, 0.72), rgba(14, 165, 233, 0.55)),
    url(images/home/cta2.png);
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

        .ss-cta-box h2 {
          margin: 0 0 1rem;
          color: white;
          font-family: Plus Jakarta Sans, sans-serif;
          font-size: clamp(2rem, 4vw, 3.1rem);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: 0.01em;
        }

        .ss-cta-box p {
          max-width: 650px;
          margin: 0 auto 2rem;
          color: white;
          font-size: 1.05rem;
          line-height: 1.75;
          font-weight: 650;
        }

        .ss-lottie-robot-label {
          position: absolute;
          left: 88px;
          top: 185px;
          z-index: 6;
          min-width: 92px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.94);
          color: #1e3a8a;
          font-size: 0.78rem;
          font-weight: 1000;
          letter-spacing: 0.01em;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.18);
        }

        .ss-hero-left-row {
  display: grid;
  grid-template-columns: 210px 1fr;
  align-items: center;
  gap: 2rem;
}

        @keyframes ssLottieRobotFloat {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }

          50% {
            transform: translateY(-16px) rotate(2deg);
          }
        }

        
        


        .ss-chat {
          position: fixed;
          left: 1.2rem;
          bottom: 1.2rem;
          z-index: 120;
          width: 58px;
          height: 58px;
          border: 0;
          border-radius: 50%;
          color: #ffffff;
          background: #0b6ea8;
          box-shadow: 0 16px 36px rgba(11,110,168,0.35);
          cursor: pointer;
        }

          .ss-footer {
            padding: 2rem 0 1.4rem;
  background:
  radial-gradient(circle at 12% 10%, rgba(16, 255, 176, 0.45), transparent 32%),
  radial-gradient(circle at 90% 16%, rgba(45, 212, 255, 0.36), transparent 34%),
  radial-gradient(circle at 70% 95%, rgba(99, 102, 241, 0.30), transparent 42%),
  linear-gradient(135deg, #011f1a 0%, #064e45 38%, #075985 68%, #11104a 100%);
  box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.12),
  inset 0 -70px 110px rgba(0, 0, 0, 0.24),
  0 24px 70px rgba(0, 0, 0, 0.26);
          }

.ss-footer-top {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr;
  gap: 1.2rem;
  align-items: center;
}

.ss-footer-brand {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.ss-footer-logo {
  width: 180px;
  flex: 0 0 180px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
}
.ss-footer-brand > div:last-child {
  min-width: 220px;
}


.ss-footer-brand strong {
  display: block;
  color: #ffffff;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: 1.45rem;
  font-weight: 950;
  line-height: 1.1;
}

.ss-footer-brand span {
  display: block;
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.2;
}

.ss-footer-contact-social {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1.25rem 1.4rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ss-footer-contact h3,
.ss-footer-social h3 {
  margin: 0 0 0.45rem;
  color: #ffffff;
  font-family: Plus Jakarta Sans, sans-serif;
  font-size: 0.9rem;
  font-weight: 950;
  letter-spacing: 0.015em;
}

.ss-contact-line {
  display: block;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 0.78rem;
  line-height: 1.35;
  font-weight: 700;
}

.ss-contact-line:hover {
  color: #ffffff;
}

.ss-social-links {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: nowrap;
}

.ss-social-links a {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border-radius: 50%;
  background: #ffffff;
  text-decoration: none;
  transition: 180ms ease;
}

.ss-social-links a img {
  width: 28.5px;
  height: 24.3px;
  display: block;
  object-fit: contain;
}

.ss-social-links a:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
}

.ss-footer-bottom {
  margin-top: 1.6rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.ss-footer-bottom span {
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.76rem;
  font-weight: 750;
}
        

        @keyframes ssPhotoFloat {
          0%, 100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -12px;
          }
        }

        @keyframes ssMarqueeMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

.ss-robot-only {
  position: absolute;
  right: 0;
  bottom: -20px;
  width: 270px;
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: ssLottieRobotFloat 3.8s ease-in-out infinite;
  filter: drop-shadow(0 22px 28px rgba(0, 0, 0, 0.28));
}

.ss-robot-only svg {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.ss-robot-only .ss-lottie-robot-label {
  position: absolute;
  left: 50%;
  top: 52%;
  z-index: 6;
  transform: translate(-50%, -50%);
  min-width: 78px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.96);
  color: #1e3a8a;
  font-size: 0.64rem;
  font-weight: 1000;
  letter-spacing: 0.01em;
  box-shadow: 0 9px 18px rgba(15, 23, 42, 0.18);
}

        @media (max-width: 1024px) {
          
        .ss-premium-layout,
.ss-learning-path {
  grid-template-columns: 1fr;
}

.ss-premium-hero-card {
  min-height: 420px;
}

        .ss-hero-content {
            grid-template-columns: 1fr;
            padding: 4rem 0;
          }

          .ss-hero-panel {
            min-height: 380px;
          }

          .ss-modules {
            grid-template-columns: repeat(2, 1fr);
      }

.ss-robot-only {
  position: relative;
  right: auto;
  bottom: -8px;
  width: 260px;
  height: 320px;
  margin-left: auto;
  margin-right: auto;
}
          

          .ss-about {
            grid-template-columns: 1fr;
          }

          .ss-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
 
          .ss-footer-top {
  grid-template-columns: 1fr;
}

.ss-footer-contact-social {
  justify-content: flex-start;
}
          
        }

        @media (max-width: 720px) {
          .ss-container {
            width: min(100% - 1.25rem, 1160px);
          }

          .ss-association-head {
  text-align: center;
}

.ss-association-card {
  width: 210px;
  height: 135px;
  flex-basis: 210px;
  border-radius: 18px;
}

.ss-logo-card img {
  max-height: 82px;
}

.ss-association-slider::before,
.ss-association-slider::after {
  width: 48px;
}
          .ss-nav-inner {
            width: 100%;
            min-height: auto;
            padding: 0.85rem 1rem;
            align-items: flex-start;
            flex-direction: column;
        }

          .ss-logo {
            width: 138px;
          }
          .ss-brand strong {
            font-size: 1.12rem;
          }

          .ss-brand span {
            font-size: 0.7rem;
          }

          .ss-nav-actions {
            justify-content: flex-start;
          }

          .ss-nav-link,
          .ss-lang {
            min-height: 36px;
            padding: 0.45rem 0.62rem;
            font-size: 0.76rem;
          }

          .ss-hero {
            min-height: auto;
            padding-top: 135px;
          }

          .ss-hero h1 {
            letter-spacing: 0.001em;
          }

          .ss-hero-actions {
            width: 100%;
          }

          .ss-primary,
          .ss-secondary {
            width: 100%;
          }

          .ss-hero-panel {
            min-height: 330px;
          }
          

        

          .ss-marquee-section {
            padding: 2.25rem 0;
          }

          .ss-marquee-card {
            width: 240px;
            height: 150px;
          }

          .ss-image-track {
            gap: 0.75rem;
            animation-duration: 22s;
          }

          .ss-image-marquee::before,
          .ss-image-marquee::after {
            width: 55px;
          }

.ss-robot-only {
  width: 230px;
  height: 290px;
  bottom: -5px;
}

.ss-robot-only .ss-lottie-robot-label {
  top: 52%;
  min-width: 72px;
  height: 22px;
  font-size: 0.6rem;
}

          .ss-about-media {
            grid-template-columns: 1fr;
          }

          .ss-about-media img:first-child {
            transform: none;
          }

          .ss-stats-grid {
            grid-template-columns: 1fr;
          }


          .ss-premium-head {
  text-align: left;
}

.ss-premium-hero-card {
  min-height: 320px;
  border-radius: 22px;
}

.ss-premium-card {
  grid-template-columns: 1fr;
  animation: none;
}

.ss-learning-path {
  padding: 1.2rem;
  border-radius: 22px;
}

.ss-path-card {
  grid-template-columns: 1fr;
}

.ss-path-circle {
  width: 48px;
  height: 48px;
}

.ss-modules {
  grid-template-columns: 1fr;
}

.ss-module {
  animation: none;
}

.ss-module-image {
  height: 210px;
}

.ss-module p {
  min-height: auto;
}

.ss-footer {
  padding: 1.3rem 0 0.8rem;
}

.ss-footer-top {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.ss-footer-contact-social {
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.ss-social-links {
  flex-wrap: wrap;
}

.ss-footer-bottom {
  align-items: flex-start;
  flex-direction: column;
}        

.ss-footer-logo {
  width: 150px;
  min-height: 72px;
}

}

        @media (max-width: 430px) {
          

          

          

          .ss-marquee-card {
            width: 210px;
            height: 132px;
          }

          .ss-marquee-header h2 {
            font-size: 1.35rem;
          }

          .ss-chat {
            width: 52px;
            height: 52px;
          }
        }
      `}</style>

      <nav className="ss-nav">
        <div className="ss-nav-inner">
          <Link href="/" className="ss-brand">
            <div className="ss-logo">
              <Logo width={165} />
            </div>
            <div className="ss-brand-line" />
            <div>
              <strong>SimuLearning</strong>
              <span>{t.by}</span>
            </div>
          </Link>

          <div className="ss-nav-actions">
            {(['en', 'hi', 'mr'] as Locale[]).map(l => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`ss-lang ${locale === l ? 'active' : ''}`}
                style={{ fontFamily: l !== 'en' ? 'Noto Sans Devanagari' : 'DM Sans' }}
              >
                {l === 'en' ? 'ENG' : l === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}

            <Link href="/courses" className="ss-nav-link">
              Courses
            </Link>
            <Link href="/login" className="ss-nav-link">
              {t.studentLogin}
            </Link>
            <Link href="/admin-login" className="ss-nav-link">
              {t.schoolLogin}
            </Link>
          </div>
        </div>
      </nav>

      <section className="ss-hero">
  <video
    className="ss-hero-video"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="videos/202606-16-1.mp4" type="video/mp4" />
  </video>

  <div className="ss-hero-overlay" />

  <div className="ss-hero-content">
          <div>
            <div className="ss-badge">
              <i />
              <span className={isDevanagari ? 'lang-hi' : ''}>{t.tagline}</span>
            </div>

            <h1 className={isDevanagari ? 'lang-hi' : ''}>{t.heroTitle}</h1>

            <p className={isDevanagari ? 'lang-hi' : ''}>{t.heroSub}</p>

            <div className="ss-hero-actions">
              <Link href="/courses" className="ss-primary">
                {t.exploreCourses} →
              </Link>
              
            </div>
          </div>

          <div className="ss-hero-panel">
            <div className="ss-robot-only">
              <SimuRobot width={220} />
              <div className="ss-lottie-robot-label">SimuLearning</div>
            </div>
          </div>
        </div>
      </section>

      <ContinuousImageSlider />

      <section className="ss-section soft">
        <div className="ss-container ss-about">
          <div className="ss-about-media">
            <img src={PHOTOS.about} alt="Robotics learning lab" />
            <img src={PHOTOS.lab} alt="Computer learning lab" />
          </div>

          <div>
            <div className="ss-about-label">
              <h1> {t.aboutBtn.replace('→', '')} </h1>
            </div>
            <h2 className={`ss-heading ${isDevanagari ? 'lang-hi' : ''}`}>
              {t.sectionTitle}
            </h2>

            <p className={`ss-desc ${isDevanagari ? 'lang-hi' : ''}`}>
              {t.sectionDesc}
            </p>

            
          </div>
        </div>
      </section>

      <section ref={statsRef} className="ss-stats">
        <div className="ss-container">
          <div className="ss-stats-grid">
            {[
              [t.statsStudents, fmtNum(count.students)],
              [t.statsCourses, `${count.courses}+`],
              [t.statsSchools, `${count.schools}+`],
              [t.statsCerts, fmtNum(count.certs)],
            ].map(([label, value]) => (
              <div key={label} className="ss-stat">
                <strong>{value}</strong>
                <span className={isDevanagari ? 'lang-hi' : ''}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    <section className="ss-section ss-association">
  <div className="ss-container">
    <div className="ss-association-head">
      <h1 className="ss-primary">Our Association</h1>
    </div>
  
    <div className="ss-association-slider">
  <div className="ss-association-track">
    {[
      { src: 'images/associations/Rayat.jpeg', type: 'logo' },
      { src: 'images/associations/Mizoram.jpeg', type: 'logo' },
      { src: 'images/associations/Ulwe.jpeg', type: 'logo' },
      { src: 'images/associations/ZP.png', type: 'logo' },
      { src: 'images/associations/snehwan.png', type: 'logo' },
      { src: 'images/associations/Delhi.png', type: 'logo' },
    ].map((item, index) => (
      <div
        key={index}
        className={`ss-association-card ${
          item.type === 'logo' ? 'ss-logo-card' : 'ss-image-card'
        }`}
      >
        <img src={item.src} alt={`Our association ${index + 1}`} />
      </div>
    ))}
  </div>
  </div>
</div>
</section>

      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-center">
            <h2 className={`ss-heading ${isDevanagari ? 'lang-hi' : ''}`}>
              {t.productTitle}
            </h2>
            <p className={`ss-desc ${isDevanagari ? 'lang-hi' : ''}`}>
              {t.productSub}
            </p>
          </div>

          <div className="ss-modules">
  {[
    {
      img: 'images/home/robotic-learning.png',
      title: 'Robotics Learning',
      desc: 'Learn automation, machines, robots and smart systems with simulated activities.',
    },
    {
      img: '/images/home/virtual-lab.png',
      title: 'Virtual IoT Learning',
      desc: 'Practice circuits, sensors and IoT experiments through digital labs.',
    },
    {
      img: 'images/home/digital-classroom.png',
      title: 'Digital Classroom',
      desc: 'Access video lessons, quizzes, assignments and learning activities.',
    },
    {
      img: 'images/home/acheivement.png',
      title:'Learning Achievements',  
      desc: 'Earn badges, XP, streaks and learning achievements while studying.',
    },
    {
      img: 'images/home/analytics.png',
      title: 'School Analytics',
      desc: 'Track student progress, completion, scores and performance reports.',
    },
    {
      img: 'images/home/certificate.png',
      title: 'Certificates',
      desc: 'Issue verified certificates after course and module completion.',
    },
  ].map((module) => (
    <div key={module.title} className="ss-module">
      <div className="ss-module-image">
        <img src={module.img} alt={module.title} />
      </div>

      <div className="ss-module-content">
        <h3>{module.title}</h3>
        <p>{module.desc}</p>

        
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      <section className="ss-section ss-premium-features">
  <div className="ss-container">
    <div className="ss-premium-head">
      <h1 className="ss-primary">LMS Features</h1>

      <h2 className={`ss-heading ${isDevanagari ? 'lang-hi' : ''}`}>
        Everything A Smart School LMS Needs
      </h2>

      <p className={`ss-desc ${isDevanagari ? 'lang-hi' : ''}`}>
        SimuLearning combines videos, quizzes, virtual labs, certificates,
        progress tracking and grade-wise AI, IoT and Robotics courses in one
        modern platform.
      </p>
    </div>

    <div className="ss-premium-layout">
      <div className="ss-premium-hero-card">
        <img
          src="images\home\LMS_feature_bg.png"
          alt="Students learning in smart classroom"
        />

        <div className="ss-premium-hero-content">
          <span>Smart Learning Dashboard</span>
          <h3>Learn with videos, labs and quizzes</h3>
          <p>
            A complete learning journey for schools, students and future-ready
            technology education.
          </p>
        </div>
      </div>

      <div className="ss-premium-feature-cards">
        {[
          ['🎥', 'e-Learning', 'Recorded topic-wise videos for easy learning.'],
          ['🔬', 'Virtual Labs', 'Practice robotics, IoT and circuits online.'],
          ['📝', 'Quiz & Tests', 'Interactive quizzes to evaluate understanding.'],
          ['🏅', 'Certificates', 'Certificates after successful course completion.'],
        ].map(([icon, title, desc]) => (
          <div key={title} className="ss-premium-card">
            <div className="ss-premium-icon">{icon}</div>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="ss-learning-path">
      <div className="ss-learning-left">
        <span className="ss-premium-tag dark">Grade-wise Courses</span>
        <h2>AI, IoT & Robotics Learning Path</h2>
        <p>
          Students move step-by-step from basic digital learning to advanced
          AI, IoT sensors, robotics automation and real-world smart projects.
        </p>

        <div className="ss-subject-badges">
          <span>Artificial Intelligence</span>
          <span>Internet of Things</span>
          <span>Robotics</span>
        </div>
      </div>

      <div className="ss-learning-right">
        {[
          ['01', 'Grade 1 - 4', 'Digital basics, creativity, logic building and simple technology activities.'],
          ['02', 'Grade 5 - 8', 'AI introduction, IoT sensors, robotics basics, coding and virtual experiments.'],
          ['03', 'Grade 9 - 12', 'Advanced AI, robotics automation, IoT systems and real-world projects.'],
        ].map(([num, title, desc]) => (
          <div key={num} className="ss-path-card">
            <div className="ss-path-circle">{num}</div>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <section className="ss-cta">
        <div className="ss-container">
          <div className="ss-cta-box">
            <h2 className={isDevanagari ? 'lang-hi' : ''}>{t.ctaTitle}</h2>
            <p className={isDevanagari ? 'lang-hi' : ''}>{t.ctaSub}</p>

            <div className="ss-hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/admin-login" className="ss-primary">
                {t.onboardSchool} →
              </Link>

            </div>
          </div>
        </div>
      </section>

      <footer className="ss-footer">
  <div className="ss-container">
    <div className="ss-footer-top">
      <div className="ss-footer-brand-box">
        <div className="ss-footer-brand">
          <div className="ss-footer-logo">
            <Logo width={180} />
          </div>

          <div
  style={{
    width: 10,
    height: 54,
    background: 'rgba(255,255,255,0.18)',
    flex: '0 0 1.5px',
  }}
/>

          <div>
            <strong>SimuLearning</strong>
            <span>{t.by}</span>
          </div>
        </div>
      </div>

      <div className="ss-footer-contact-social">
        <div className="ss-footer-contact">
          <h3>Contact</h3>

          <div className="ss-contact-line">
            <span>📍 SimuSoft Technologies, Pune, Maharashtra, India</span>
          </div>

          <a className="ss-contact-line" href="mailto:sunil@simusoft.co.in">
            <span>📧 sunil@simusoft.co.in</span>
          </a>
        </div>

        <div className="ss-footer-social">
          <h3>Social Media</h3>

          <div className="ss-social-links">
            <a href="https://www.linkedin.com/company/simusoft-technologies/"  rel="noreferrer" aria-label="LinkedIn">
              <img src="images/social/linkedIn.png" alt="LinkedIn" />
            </a>

            <a href="https://www.instagram.com/simusoft_technologies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="  rel="noreferrer" aria-label="Instagram">
              <img src="images/social/instagram.png" alt="Instagram" />
            </a>

            <a href="https://www.facebook.com/share/1B55ZrGZV9/?mibextid=wwXIfr"  rel="noreferrer" aria-label="Facebook">
              <img src="images/social/facebook.png" alt="Facebook" />
            </a>

            <a href="https://youtube.com/@simusoft_sunilchore?si=cFZZVnTieHR8UZsG"  rel="noreferrer" aria-label="YouTube">
              <img src="images/social/youtube.png" alt="YouTube" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="ss-footer-bottom">
      <span>© {new Date().getFullYear()} SimuSoft Technologies. All rights reserved.</span>
      <span>AI · IoT · Robotics </span>
    </div>
  </div>
</footer>

      {/* <ChatButton /> */}
    </main>
  );
}