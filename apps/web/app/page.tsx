'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

const SimuSoftLogo = ({ height = 28 }: { height?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 14400 6000"
    style={{ shapeRendering: 'geometricPrecision', fillRule: 'evenodd', display: 'block' }}>
    <defs>
      <style>{`.p0{fill:#fff;fill-rule:nonzero}.p1{fill:#0078BF;fill-rule:nonzero}.p2{fill:url(#lg)}.p3{fill:#FEFEFE;fill-rule:nonzero}`}</style>
      <linearGradient id="lg" gradientUnits="userSpaceOnUse" x1="3333.69" y1="162.8" x2="4519.22" y2="1736.95">
        <stop offset="0" stopColor="#B0D35A"/><stop offset=".49" stopColor="#3FAB99"/><stop offset="1" stopColor="#00ABC8"/>
      </linearGradient>
    </defs>
    <path className="p0" d="M2637.45 2948.38l-360.37-145.77c-137.54-56.87-230.14-130.22-277.84-220.09-47.68-89.86-63.27-202.65-46.77-338.36 27.53-201.73 97.67-336.98 210.44-405.74 112.79-68.77 288.39-103.16 526.81-103.16 236.57 0 442.88 25.67 618.94 77.03l-41.26 283.33c-165.07-5.51-361.29-8.25-588.69-8.25-111.87-1.85-187.97 6.87-228.32 26.14-40.34 19.24-66.94 71.05-79.78 155.43-9.16 62.33-4.12 105.89 15.13 130.66 19.27 24.77 64.65 50.88 136.16 78.4l341.1 132.04c144.89 56.84 240.25 127.89 286.1 213.17 45.86 85.29 59.61 202.21 41.26 350.76-27.51 209.06-94.89 349.82-202.17 422.25-107.29 72.43-289.31 108.65-546.05 108.65-212.74 0-430.06-24.75-651.96-74.27l44.01-299.84c388.79 9.17 585.93 13.76 591.43 13.76 128.38 0 215.49-12.4 261.34-37.15 45.84-24.74 75.18-77.49 88.03-158.18 7.33-62.34 1.84-105.43-16.5-129.28-18.34-23.84-58.69-47.69-121.04-71.53zm1079.59 720.74l-404.38 0 189.82-1356.2 404.37 0-189.81 1356.2zm757.74-1356.2l0 244.85c99.03-99.04 191.19-171.02 276.47-215.95 85.28-44.93 174.68-67.39 268.21-67.39 99.03 0 176.96 22 233.82 66.02 56.85 44.01 89.86 106.36 99.04 187.05 170.55-168.71 341.11-253.07 511.65-253.07 124.71 0 215.94 34.38 273.7 103.17 57.78 68.76 78.42 162.73 61.9 281.94l-140.29 1009.58-404.37 0 126.54-899.54c7.34-56.85 2.74-96.28-13.76-118.28-16.5-22.01-44.93-33.01-85.28-33.01-45.84 0-94.44 14.67-145.79 44.02-51.36 29.33-121.04 83.43-209.06 162.29l-118.3 844.52-390.61 0 123.78-899.54c9.18-55.03 6.42-93.98-8.25-116.91-14.67-22.92-44.02-34.38-88.02-34.38-47.68 0-97.66 14.21-149.93 42.63-52.27 28.42-120.57 79.32-204.94 152.67l-118.29 855.53-404.37 0 189.81-1356.2 316.34 0zm3288.53 0l-187.05 1356.2-313.6 0 0-255.82c-201.73 194.39-397.04 291.57-585.93 291.57-130.22 0-225.11-33.92-284.71-101.78-59.61-67.85-80.24-161.38-61.9-280.58l140.29-1009.59 407.13 0-129.3 899.56c-7.33 55.01-3.21 93.97 12.4 116.92 15.58 22.91 45.38 34.36 89.4 34.36 58.67 0 115.98-15.57 171.92-46.76 55.93-31.17 130.67-86.18 224.2-165.04l115.53-839.04 401.62 0zm887.04 635.46l-360.36-145.77c-137.56-56.87-230.16-130.22-277.85-220.09-47.68-89.86-63.26-202.65-46.76-338.36 27.52-201.73 97.67-336.98 210.44-405.74 112.79-68.77 288.39-103.16 526.8-103.16 236.56 0 442.89 25.67 618.93 77.03l-41.26 283.33c-165.05-5.51-361.27-8.25-588.68-8.25-111.88-1.85-187.97 6.87-228.32 26.14-40.35 19.24-66.93 71.05-79.77 155.43-9.17 62.33-4.13 105.89 15.13 130.66 19.25 24.77 64.64 50.88 136.15 78.4l341.11 132.04c144.88 56.84 240.24 127.89 286.09 213.17 45.85 85.29 59.6 202.21 41.26 350.76-27.5 209.06-94.9 349.82-202.17 422.25-107.28 72.43-289.31 108.65-546.05 108.65-212.73 0-430.06-24.75-651.96-74.27l44.02-299.84c388.79 9.17 585.92 13.76 591.43 13.76 128.37 0 215.48-12.4 261.33-37.15 45.85-24.74 75.19-77.49 88.02-158.18 7.33-62.34 1.85-105.43-16.5-129.28-18.34-23.84-58.68-47.69-121.03-71.53zm1478.47-673.95c251.24 0 426.38 56.84 525.41 170.54 99.04 113.7 130.2 301.69 93.54 563.92-34.85 254.93-110.5 434.66-226.94 539.18-116.47 104.55-297.56 156.8-543.31 156.8-249.4 0-425-56.85-526.78-170.55-101.8-113.7-134.34-299.85-97.65-558.43 36.66-256.75 112.77-437.82 228.31-543.28 115.53-105.46 298.01-158.18 547.42-158.18zm-2.75 305.35c-111.88 0-192.1 28.41-240.69 85.28-48.61 56.83-84.83 171.47-108.66 343.83-22.01 157.73-19.26 262.28 8.24 313.62 27.51 51.34 94.45 77.02 200.82 77.02 110.04 0 188.88-28.88 236.56-86.65 47.7-57.77 83.45-170.11 107.28-336.99 23.85-157.71 21.56-263.16-6.86-316.35-28.42-53.18-94-79.76-196.69-79.76zm1896.6-594.19l-242.07 0c-71.53 0-123.34 12.38-155.43 37.15-32.09 24.74-53.63 72.88-64.64 144.42l-19.26 145.76 371.38 0-35.78 272.36-376.86 0-181.82 1418.14c-41.36 322.73-200.15 485.68-480.52 534.68-79.23 13.83-205.69 26.02-379.06 36.48l45.22-309.48 206.05-50.73c83.77-20.61 131.13-82.25 164.96-131.09 33.8-48.77 58.41-127.38 72.47-244.11l151.07-1253.89-233.82 0 33.01-258.59 239.33-13.77 30.25-211.79c38.52-275.08 197.15-412.63 475.9-412.63 181.55 0 330.11 9.16 445.64 27.5l-66.02 269.59zm493.66 599.69l-90.77 649.19c-7.33 51.36-3.21 85.73 12.37 103.17 15.58 17.43 50.89 26.12 105.9 26.12l181.57 0 19.25 286.09c-97.19 34.84-223.73 52.28-379.61 52.28-128.37 0-223.74-35.31-286.1-105.91-62.34-70.61-84.36-168.26-66.02-292.98l104.55-717.96-228.21 0 36.84-269.95 229.86-2.41 55.03-379.6 398.87 0-52.28 379.6 374.13 0-38.5 272.36-376.88 0z"/>
    <path className="p1" d="M1965.05 4410.25l-126.36-45.95c-45.95-17.23-77.22-41.33-93.82-72.28-16.59-30.96-21.7-70.36-15.31-118.23 10.2-70.2 33.82-116.63 70.84-139.28 37.01-22.65 94.77-33.99 173.27-33.99 81.69 0 150.62 7.66 206.78 22.97l-12.44 84.26c-75.31-2.57-139.78-3.84-193.38-3.84-20.43 0-34.95.16-43.56.47-8.61.33-18.99 1.76-31.12 4.31-12.12 2.57-20.73 6.71-25.84 12.45-5.1 5.74-9.89 13.56-14.36 23.45-4.47 9.89-7.98 22.83-10.53 38.77-3.83 27.44-2.07 45.96 5.26 55.53 7.34 9.57 24.74 19.14 52.18 28.72l122.53 44.04c49.15 17.87 81.54 41.47 97.17 70.84 15.63 29.35 19.94 69.56 12.92 120.62-9.57 72.11-32.39 120.3-68.44 144.55-36.06 24.25-97.49 36.37-184.28 36.37-72.76 0-144.24-7.34-214.44-22.01l13.4-87.12c111.69 2.56 177.1 3.83 196.25 3.83 51.69 0 86.47-5.1 104.34-15.31 17.87-10.22 29.04-33.18 33.51-68.93 3.83-27.44 2.07-46.11-5.26-56-7.34-9.89-23.78-19.31-49.31-28.24zm383.88-410.69l52.65 0c11.49 0 19.95 3.2 25.37 9.57 5.42 6.39 7.5 15.01 6.22 25.85l-6.7 52.65c-3.83 21.06-15.96 31.59-36.37 31.59l-52.66 0c-24.25 0-34.78-12.12-31.59-36.37l7.66-51.7c1.91-21.06 13.72-31.59 35.42-31.59zm-7.66 672.99l-115.83 0 66.06-469.08 114.87 0-65.1 469.08z"/>
    <path className="p2" d="M4588.77 1177.76c0 4.52 0 9.34.27 13.87.26 4.81.53 9.33.53 14.13 0 4.83-.27 9.35-.53 14.14-.27 4.55-.27 9.35-.27 13.89l202.3 125.98-124.1 299.43-232.18-53.11c-12.57 13.63-25.63 26.69-39.26 38.97l53.11 232.46-299.43 124.1-125.97-202.29c-4.55 0-9.35 0-13.89.26-4.8.26-9.32.53-14.12.53-4.84 0-9.35-.27-14.16-.53-4.53-.26-9.34-.26-13.88-.26l-125.98 202.29-299.43-124.1 53.11-232.46c-13.62-12.28-26.69-25.34-38.97-38.97l-232.46 53.11-124.11-299.43 202.3-125.98c0-4.54 0-9.34-.27-13.89-.26-4.79-.53-9.31-.53-14.14 0-4.8.27-9.32.53-14.13.27-4.53.27-9.35.27-13.87l-202.3-125.99 124.11-299.43 232.46 53.1c12.28-13.6 25.35-26.68 38.97-39.24l-53.11-232.18 299.43-124.11 125.98 202.3c4.54 0 9.35 0 13.88-.27 4.81-.26 9.32-.53 14.16-.53 4.8 0 9.32.27 14.12.53 4.54.27 9.34.27 13.89.27l125.97-202.3 299.43 124.11-53.11 232.18c13.63 12.56 26.69 25.64 39.26 39.24l232.18-53.1 124.1 299.43-202.3 125.99z"/>
    <path className="p3" d="M3995.22 1013.48c26.51 0 51.46 5.06 74.85 15.17 23.38 9.96 43.8 23.74 61.08 41.18 17.44 17.29 31.23 37.71 41.18 61.09 10.12 23.39 15.18 48.34 15.18 74.85 0 26.52-5.06 51.48-15.18 74.86-9.95 23.38-23.74 43.81-41.18 61.09-17.28 17.44-37.7 31.06-61.08 41.17-23.39 10.13-48.34 15.18-74.85 15.18-26.53 0-51.48-5.05-74.87-15.18-23.38-10.11-43.79-23.73-61.07-41.17-17.45-17.28-31.06-37.71-41.19-61.09-10.12-23.38-15.18-48.34-15.18-74.86 0-26.51 5.06-51.46 15.18-74.85 10.13-23.38 23.74-43.8 41.19-61.09 17.28-17.44 37.69-31.22 61.07-41.18 23.39-10.11 48.34-15.17 74.87-15.17z"/>
  </svg>
);

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

      {/* ── NAVBAR ── */}
      <nav className="sl-nav">
        <div className="sl-nav-inner">
          <Link href="/" className="sl-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SimuSoftLogo height={24} />
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
              <div>
                <div className="sl-logo-name">SimuLearning</div>
                <div className="sl-logo-sub">by SimuSoft Technologies</div>
              </div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/courses" className="sl-nav-link">Courses</Link>
            <button className="sl-nav-link" onClick={() => switchLocale(locale === 'en' ? 'hi' : locale === 'hi' ? 'mr' : 'en')}>
              {locale === 'en' ? 'हिं' : locale === 'hi' ? 'मरा' : 'EN'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/login" className="sl-nav-link">{t.studentLogin}</Link>
            <Link href="/admin-login" className="sl-nav-cta">{t.schoolLogin}</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #0D1B2E 0%, #0F172A 50%, #0D2137 100%)', padding: 'clamp(4rem,8vw,7rem) 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,115,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,115,232,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* glow orbs */}
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="animate-fadeUp" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.35)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: '1.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00BCD4', display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#67E8F9', fontFamily: 'DM Sans' }}>{t.tagline}</span>
            </div>
            <h1 className={`animate-fadeUp delay-100 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              {t.hero1}
            </h1>
            <h1 className={`animate-fadeUp delay-200 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,5vw,3.5rem)', background: 'linear-gradient(135deg, #00BCD4, #4DD0E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              {t.hero2}
            </h1>
            <p className={`animate-fadeUp delay-300 ${isDevanagari ? 'lang-hi' : ''}`} style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 480, fontFamily: 'DM Sans' }}>
              {t.heroSub}
            </p>
            <div className="animate-fadeUp delay-400" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/courses" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.8rem 1.75rem' }}>{t.exploreCourses}</Link>
              <Link href="/admin-login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.75rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                {t.schoolLogin} →
              </Link>
            </div>
          </div>
          <div className="animate-fadeUp delay-200" style={{ display: 'flex', justifyContent: 'center' }}>
            <IoTHeroIllustration />
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
            <SimuSoftLogo height={20} />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
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
