'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const T = {
  en: {
    tagline: "K-12 AI & IoT Learning Platform",
    hero1: "AI & IoT",
    hero2: "Made Easy",
    hero3: "for Grade 1 to Grade 12",
    heroSub: "Hands-on virtual IoT labs, smart quizzes, gamified badges and verified certificates — built for every school student across India.",
    exploreCourses: "Explore Courses →",
    schoolLogin: "School Login",
    studentLogin: "Student Login",
    gradeTitle: "Pick Your Grade",
    gradeSub: "Tap your grade to discover what you will learn",
    featTitle: "Everything a Student Needs",
    featSub: "One platform, one complete learning journey — Grade 1 to Grade 12",
    howTitle: "How It Works",
    howSub: "Three simple steps from school to certificate",
    step1t: "School Onboards", step1d: "School admin uploads student roster and assigns courses",
    step2t: "Students Learn", step2d: "Watch lessons, run IoT simulations, take quizzes, earn badges",
    step3t: "Get Certified", step3d: "Score 60%+ and receive a tamper-proof digital certificate",
    ctaTitle: "Bring SimuLearning to Your School",
    ctaSub: "Students access the platform through their school. If you are a school administrator, onboard your institution today.",
    onboardSchool: "Onboard Your School →",
    adminLogin: "School Admin Login",
    studentNote: "Already a student? Ask your school administrator for access.",
    statsStudents: "Students", statsCourses: "Courses", statsSchools: "Schools", statsCerts: "Certificates",
    by: "by SimuSoft Technologies",
    grade: "Grade",
    features: [
      { icon: "🔬", title: "Virtual IoT Labs", desc: "Run real Wokwi simulations — blink LEDs, read sensors, control motors — right in your browser. No hardware needed." },
      { icon: "🏆", title: "Gamified Progress", desc: "Earn XP, unlock badges like First Step and On Fire, maintain streaks and climb your school leaderboard." },
      { icon: "📜", title: "Verified Certificates", desc: "Complete a course and get a tamper-proof digital certificate with a unique code anyone can verify." },
      { icon: "🧠", title: "Smart Quizzes", desc: "MCQ assessments graded instantly with per-question feedback so students know exactly what to revise." },
      { icon: "📊", title: "Teacher Analytics", desc: "Live class dashboards — completion rates, quiz scores, lab attempts, streaks — all in one place for teachers." },
      { icon: "🌐", title: "3 Languages", desc: "Full content available in English, हिंदी and मराठी so every student learns in their most comfortable language." },
    ],
    grades: {
      1: { title: "Grade 1 — Curious Beginners", desc: "Introduction to computers, robots and how electricity works. Simple colorful activities.", topics: ["What is a Computer?", "Electricity Basics", "Fun Robots", "Simple Sensors"] },
      2: { title: "Grade 2 — Little Explorers", desc: "Light, sound and movement sensors. First look at how devices communicate.", topics: ["Light Sensors", "Sound Sensors", "Device Talk", "Simple Circuits"] },
      3: { title: "Grade 3 — Budding Makers", desc: "Basic circuits, batteries and LEDs. Build your first virtual circuit.", topics: ["Basic Circuits", "LEDs & Batteries", "Virtual Lab Intro", "Hands-on Projects"] },
      4: { title: "Grade 4 — Junior Tinkerers", desc: "Temperature and humidity sensors. Input vs output. First microcontrollers.", topics: ["Temp Sensors", "Input vs Output", "Microcontrollers", "Data Logging"] },
      5: { title: "Grade 5 — Young Engineers", desc: "Virtual weather station. Introduction to Internet of Things.", topics: ["Weather Stations", "IoT Concept", "Wi-Fi Basics", "Sensor Networks"] },
      6: { title: "Grade 6 — IoT Starters", desc: "Arduino programming intro. Write your first LED blink program.", topics: ["Arduino Intro", "First Program", "Variables & Loops", "LED Projects"] },
      7: { title: "Grade 7 — Code Builders", desc: "Serial communication, reading live sensor data, LCD displays.", topics: ["Serial Monitor", "Live Sensor Data", "LCD Displays", "Real-time Graphs"] },
      8: { title: "Grade 8 — Protocol Pioneers", desc: "I2C, SPI, UART protocols. Multi-sensor projects in virtual labs.", topics: ["I2C Protocol", "SPI Basics", "UART Comm", "Multi-sensor Projects"] },
      9: { title: "Grade 9 — ESP32 Explorers", desc: "ESP32 Wi-Fi, sending data to cloud, building live dashboards.", topics: ["ESP32 Basics", "Wi-Fi Setup", "Cloud Dashboard", "MQTT Protocol"] },
      10: { title: "Grade 10 — Cloud Connectors", desc: "Home automation, smartphone control, automation rules.", topics: ["Home Automation", "Mobile Control", "Push Alerts", "Automation Rules"] },
      11: { title: "Grade 11 — Industrial IoT", desc: "Modbus, CANbus, SCADA systems, Edge AI on embedded devices.", topics: ["Modbus & CANbus", "SCADA Systems", "Edge AI", "Industrial Sensors"] },
      12: { title: "Grade 12 — AI Innovators", desc: "Deep learning on IoT devices, computer vision, capstone project.", topics: ["Deep Learning", "Computer Vision", "Predictive Analytics", "Capstone Project"] },
    }
  },
  hi: {
    tagline: "K-12 AI और IoT शिक्षण मंच",
    hero1: "AI & IoT",
    hero2: "आसान हो गया",
    hero3: "कक्षा 1 से 12 के लिए",
    heroSub: "वर्चुअल IoT लैब, स्मार्ट क्विज़, गेमिफाइड बैज और सत्यापित प्रमाणपत्र — भारत के हर स्कूली छात्र के लिए।",
    exploreCourses: "कोर्स देखें →",
    schoolLogin: "स्कूल लॉगिन",
    studentLogin: "छात्र लॉगिन",
    gradeTitle: "अपनी कक्षा चुनें",
    gradeSub: "जानें आपकी कक्षा में क्या सिखाया जाएगा",
    featTitle: "छात्र को जो चाहिए वो सब यहाँ है",
    featSub: "एक मंच, पूरी शिक्षा यात्रा — कक्षा 1 से 12",
    howTitle: "कैसे काम करता है",
    howSub: "स्कूल से प्रमाणपत्र तक तीन आसान चरण",
    step1t: "स्कूल जुड़ता है", step1d: "स्कूल प्रशासक छात्रों की सूची अपलोड करता है",
    step2t: "छात्र सीखते हैं", step2d: "पाठ देखें, IoT सिमुलेशन चलाएं, बैज कमाएं",
    step3t: "प्रमाणपत्र पाएं", step3d: "60%+ अंक पर डिजिटल प्रमाणपत्र मिलता है",
    ctaTitle: "SimuLearning अपने स्कूल में लाएं",
    ctaSub: "छात्र अपने स्कूल के माध्यम से इस प्लेटफॉर्म का उपयोग करते हैं।",
    onboardSchool: "स्कूल जोड़ें →",
    adminLogin: "एडमिन लॉगिन",
    studentNote: "क्या आप छात्र हैं? अपने स्कूल प्रशासक से संपर्क करें।",
    statsStudents: "छात्र", statsCourses: "कोर्स", statsSchools: "स्कूल", statsCerts: "प्रमाणपत्र",
    by: "SimuSoft Technologies द्वारा",
    grade: "कक्षा",
    features: [
      { icon: "🔬", title: "वर्चुअल IoT लैब", desc: "Wokwi सिमुलेशन चलाएं — LED जलाएं, सेंसर पढ़ें, मोटर चलाएं — बिना किसी हार्डवेयर के।" },
      { icon: "🏆", title: "गेमिफाइड प्रगति", desc: "XP कमाएं, बैज अनलॉक करें, स्ट्रीक बनाए रखें और अपने स्कूल लीडरबोर्ड में ऊपर चढ़ें।" },
      { icon: "📜", title: "सत्यापित प्रमाणपत्र", desc: "कोर्स पूरा करें और एक यूनिक कोड वाला डिजिटल प्रमाणपत्र पाएं।" },
      { icon: "🧠", title: "स्मार्ट क्विज़", desc: "MCQ टेस्ट तुरंत जाँचे जाते हैं और हर सवाल पर फीडबैक मिलता है।" },
      { icon: "📊", title: "शिक्षक विश्लेषण", desc: "लाइव क्लास डैशबोर्ड — प्रगति, स्कोर, लैब प्रयास — सब एक जगह।" },
      { icon: "🌐", title: "3 भाषाएं", desc: "English, हिंदी और मराठी में पूरी सामग्री उपलब्ध है।" },
    ],
    grades: {
      1: { title: "कक्षा 1 — जिज्ञासु शुरुआत", desc: "कंप्यूटर, रोबोट और बिजली की मूल जानकारी।", topics: ["कंप्यूटर क्या है?", "बिजली की बेसिक्स", "मजेदार रोबोट", "सरल सेंसर"] },
      2: { title: "कक्षा 2 — छोटे खोजकर्ता", desc: "प्रकाश, ध्वनि और गति सेंसर। उपकरण कैसे बात करते हैं।", topics: ["प्रकाश सेंसर", "ध्वनि सेंसर", "डिवाइस संचार", "सरल सर्किट"] },
      3: { title: "कक्षा 3 — नन्हे निर्माता", desc: "सर्किट, बैटरी और LED। पहला वर्चुअल सर्किट बनाएं।", topics: ["बेसिक सर्किट", "LED और बैटरी", "वर्चुअल लैब", "प्रोजेक्ट"] },
      4: { title: "कक्षा 4 — जूनियर टिंकरर", desc: "तापमान और आर्द्रता सेंसर। इनपुट बनाम आउटपुट।", topics: ["तापमान सेंसर", "इनपुट-आउटपुट", "माइक्रोकंट्रोलर", "डेटा लॉगिंग"] },
      5: { title: "कक्षा 5 — युवा इंजीनियर", desc: "वर्चुअल मौसम स्टेशन। IoT की अवधारणा।", topics: ["मौसम स्टेशन", "IoT अवधारणा", "Wi-Fi बेसिक्स", "सेंसर नेटवर्क"] },
      6: { title: "कक्षा 6 — IoT स्टार्टर", desc: "Arduino प्रोग्रामिंग परिचय। पहला LED ब्लिंक प्रोग्राम।", topics: ["Arduino परिचय", "पहला प्रोग्राम", "वेरिएबल्स", "LED प्रोजेक्ट"] },
      7: { title: "कक्षा 7 — कोड बिल्डर", desc: "सीरियल संचार, लाइव सेंसर डेटा, LCD डिस्प्ले।", topics: ["सीरियल मॉनिटर", "लाइव डेटा", "LCD डिस्प्ले", "रियल-टाइम ग्राफ"] },
      8: { title: "कक्षा 8 — प्रोटोकॉल पायोनियर", desc: "I2C, SPI, UART प्रोटोकॉल। मल्टी-सेंसर प्रोजेक्ट।", topics: ["I2C प्रोटोकॉल", "SPI बेसिक्स", "UART", "मल्टी-सेंसर"] },
      9: { title: "कक्षा 9 — ESP32 एक्सप्लोरर", desc: "ESP32 Wi-Fi, क्लाउड पर डेटा भेजें, लाइव डैशबोर्ड।", topics: ["ESP32 बेसिक्स", "Wi-Fi सेटअप", "क्लाउड डैशबोर्ड", "MQTT"] },
      10: { title: "कक्षा 10 — क्लाउड कनेक्टर", desc: "होम ऑटोमेशन, स्मार्टफोन कंट्रोल।", topics: ["होम ऑटोमेशन", "मोबाइल कंट्रोल", "ऑटोमेशन नियम", "अलर्ट"] },
      11: { title: "कक्षा 11 — इंडस्ट्रियल IoT", desc: "Modbus, SCADA सिस्टम, Edge AI।", topics: ["Modbus", "SCADA", "Edge AI", "इंडस्ट्रियल सेंसर"] },
      12: { title: "कक्षा 12 — AI इनोवेटर", desc: "डीप लर्निंग, कंप्यूटर विजन, कैपस्टोन प्रोजेक्ट।", topics: ["डीप लर्निंग", "कंप्यूटर विजन", "प्रेडिक्टिव", "कैपस्टोन"] },
    }
  },
  mr: {
    tagline: "K-12 AI आणि IoT शिक्षण मंच",
    hero1: "AI & IoT",
    hero2: "सोपे केले",
    hero3: "इयत्ता 1 ते 12 साठी",
    heroSub: "व्हर्च्युअल IoT लॅब, स्मार्ट क्विझ, गेमिफाइड बॅज आणि प्रमाणित दाखले — भारतातील प्रत्येक शाळकरी विद्यार्थ्यासाठी.",
    exploreCourses: "अभ्यासक्रम पाहा →",
    schoolLogin: "शाळा लॉगिन",
    studentLogin: "विद्यार्थी लॉगिन",
    gradeTitle: "तुमची इयत्ता निवडा",
    gradeSub: "तुमच्या इयत्तेत काय शिकवले जाते ते जाणून घ्या",
    featTitle: "विद्यार्थ्याला जे हवे ते सर्व येथे आहे",
    featSub: "एक मंच, संपूर्ण शिक्षण प्रवास — इयत्ता 1 ते 12",
    howTitle: "हे कसे काम करते",
    howSub: "शाळेपासून प्रमाणपत्रापर्यंत तीन सोपे टप्पे",
    step1t: "शाळा सामील होते", step1d: "शाळा प्रशासक विद्यार्थ्यांची यादी अपलोड करतो",
    step2t: "विद्यार्थी शिकतात", step2d: "धडे पाहा, IoT सिम्युलेशन चालवा, बॅज मिळवा",
    step3t: "दाखला मिळवा", step3d: "60%+ गुण मिळवून डिजिटल दाखला मिळवा",
    ctaTitle: "SimuLearning तुमच्या शाळेत आणा",
    ctaSub: "विद्यार्थी त्यांच्या शाळेद्वारे हा मंच वापरतात.",
    onboardSchool: "शाळा नोंदवा →",
    adminLogin: "प्रशासक लॉगिन",
    studentNote: "तुम्ही विद्यार्थी आहात का? तुमच्या शाळा प्रशासकाशी संपर्क साधा.",
    statsStudents: "विद्यार्थी", statsCourses: "अभ्यासक्रम", statsSchools: "शाळा", statsCerts: "दाखले",
    by: "SimuSoft Technologies तर्फे",
    grade: "इयत्ता",
    features: [
      { icon: "🔬", title: "व्हर्च्युअल IoT लॅब", desc: "Wokwi सिम्युलेशन चालवा — LED लावा, सेंसर वाचा, मोटर चालवा — कोणत्याही हार्डवेअरशिवाय." },
      { icon: "🏆", title: "गेमिफाइड प्रगती", desc: "XP मिळवा, बॅज अनलॉक करा, स्ट्रीक टिकवा आणि शाळेच्या लीडरबोर्डवर वर जा." },
      { icon: "📜", title: "प्रमाणित दाखले", desc: "अभ्यासक्रम पूर्ण करा आणि युनिक कोड असलेला डिजिटल दाखला मिळवा." },
      { icon: "🧠", title: "स्मार्ट क्विझ", desc: "MCQ परीक्षा त्वरित तपासल्या जातात आणि प्रत्येक प्रश्नावर अभिप्राय मिळतो." },
      { icon: "📊", title: "शिक्षक विश्लेषण", desc: "लाइव्ह वर्ग डॅशबोर्ड — प्रगती, गुण, लॅब प्रयत्न — सर्व एका ठिकाणी." },
      { icon: "🌐", title: "3 भाषा", desc: "English, हिंदी आणि मराठी मध्ये संपूर्ण सामग्री उपलब्ध आहे." },
    ],
    grades: {
      1: { title: "इयत्ता 1 — जिज्ञासू सुरुवात", desc: "संगणक, रोबोट आणि वीजेची मूलभूत ओळख.", topics: ["संगणक म्हणजे काय?", "विजेची ओळख", "मजेशीर रोबोट", "साधे सेंसर"] },
      2: { title: "इयत्ता 2 — छोटे संशोधक", desc: "प्रकाश, आवाज आणि हालचाल सेंसर.", topics: ["प्रकाश सेंसर", "आवाज सेंसर", "उपकरण संवाद", "साधे सर्किट"] },
      3: { title: "इयत्ता 3 — नवनिर्माते", desc: "सर्किट, बॅटरी आणि LED. पहिले व्हर्च्युअल सर्किट.", topics: ["मूलभूत सर्किट", "LED आणि बॅटरी", "व्हर्च्युअल लॅब", "प्रकल्प"] },
      4: { title: "इयत्ता 4 — कनिष्ठ टिंकरर", desc: "तापमान आणि आर्द्रता सेंसर. इनपुट विरुद्ध आउटपुट.", topics: ["तापमान सेंसर", "इनपुट-आउटपुट", "मायक्रोकंट्रोलर", "डेटा लॉगिंग"] },
      5: { title: "इयत्ता 5 — तरुण अभियंते", desc: "व्हर्च्युअल हवामान केंद्र. IoT संकल्पना.", topics: ["हवामान केंद्र", "IoT संकल्पना", "Wi-Fi ओळख", "सेंसर नेटवर्क"] },
      6: { title: "इयत्ता 6 — IoT स्टार्टर", desc: "Arduino प्रोग्रामिंग परिचय. पहिला LED ब्लिंक.", topics: ["Arduino परिचय", "पहिला प्रोग्राम", "व्हेरिएबल्स", "LED प्रकल्प"] },
      7: { title: "इयत्ता 7 — कोड बिल्डर", desc: "सीरियल संवाद, लाइव्ह सेंसर डेटा, LCD डिस्प्ले.", topics: ["सीरियल मॉनिटर", "लाइव्ह डेटा", "LCD डिस्प्ले", "रिअल-टाइम"] },
      8: { title: "इयत्ता 8 — प्रोटोकॉल पायोनियर", desc: "I2C, SPI, UART प्रोटोकॉल.", topics: ["I2C प्रोटोकॉल", "SPI ओळख", "UART", "मल्टी-सेंसर"] },
      9: { title: "इयत्ता 9 — ESP32 एक्सप्लोरर", desc: "ESP32 Wi-Fi, क्लाउडवर डेटा, लाइव्ह डॅशबोर्ड.", topics: ["ESP32 ओळख", "Wi-Fi सेटअप", "क्लाउड डॅशबोर्ड", "MQTT"] },
      10: { title: "इयत्ता 10 — क्लाउड कनेक्टर", desc: "होम ऑटोमेशन, स्मार्टफोन नियंत्रण.", topics: ["होम ऑटोमेशन", "मोबाइल नियंत्रण", "स्वयंचलित नियम", "अलर्ट"] },
      11: { title: "इयत्ता 11 — औद्योगिक IoT", desc: "Modbus, SCADA, Edge AI.", topics: ["Modbus", "SCADA", "Edge AI", "औद्योगिक सेंसर"] },
      12: { title: "इयत्ता 12 — AI इनोव्हेटर", desc: "डीप लर्निंग, कॉम्प्युटर व्हिजन, कॅपस्टोन.", topics: ["डीप लर्निंग", "कॉम्प्युटर व्हिजन", "प्रेडिक्टिव", "कॅपस्टोन"] },
    }
  }
};

// ─── SIMUSOFT LOGO ────────────────────────────────────────────────────────────
const SimuSoftLogo = ({ height = 40 }: { height?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" height={height}
    viewBox="0 0 14400 6000"
    style={{ shapeRendering: 'geometricPrecision', imageRendering: 'optimizeQuality' as React.CSSProperties['imageRendering'], fillRule: 'evenodd' }}>
    <defs>
      <style>{`.fl0{fill:#2B2A29;fill-rule:nonzero}.fl1{fill:#0078BF;fill-rule:nonzero}.fl2{fill:url(#lg0)}.fl3{fill:#FEFEFE;fill-rule:nonzero}.st0{stroke:#FEFEFE;stroke-width:26.46;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:5.01585;fill:none;fill-rule:nonzero}`}</style>
      <linearGradient id="lg0" gradientUnits="userSpaceOnUse" x1="3333.69" y1="162.8" x2="4519.22" y2="1736.95">
        <stop offset="0" stopColor="#B0D35A" />
        <stop offset="0.49" stopColor="#3FAB99" />
        <stop offset="1" stopColor="#00ABC8" />
      </linearGradient>
    </defs>
    <path className="fl0" d="M2637.45 2948.38l-360.37 -145.77c-137.54,-56.87 -230.14,-130.22 -277.84,-220.09 -47.68,-89.86 -63.27,-202.65 -46.77,-338.36 27.53,-201.73 97.67,-336.98 210.44,-405.74 112.79,-68.77 288.39,-103.16 526.81,-103.16 236.57,0 442.88,25.67 618.94,77.03l-41.26 283.33c-165.07,-5.51 -361.29,-8.25 -588.69,-8.25 -111.87,-1.85 -187.97,6.87 -228.32,26.14 -40.34,19.24 -66.94,71.05 -79.78,155.43 -9.16,62.33 -4.12,105.89 15.13,130.66 19.27,24.77 64.65,50.88 136.16,78.4l341.1 132.04c144.89,56.84 240.25,127.89 286.1,213.17 45.86,85.29 59.61,202.21 41.26,350.76 -27.51,209.06 -94.89,349.82 -202.17,422.25 -107.29,72.43 -289.31,108.65 -546.05,108.65 -212.74,0 -430.06,-24.75 -651.96,-74.27l44.01 -299.84c388.79,9.17 585.93,13.76 591.43,13.76 128.38,0 215.49,-12.4 261.34,-37.15 45.84,-24.74 75.18,-77.49 88.03,-158.18 7.33,-62.34 1.84,-105.43 -16.5,-129.28 -18.34,-23.84 -58.69,-47.69 -121.04,-71.53zm1079.59 720.74l-404.38 0 189.82 -1356.2 404.37 0 -189.81 1356.2zm757.74 -1356.2l0 244.85c99.03,-99.04 191.19,-171.02 276.47,-215.95 85.28,-44.93 174.68,-67.39 268.21,-67.39 99.03,0 176.96,22 233.82,66.02 56.85,44.01 89.86,106.36 99.04,187.05 170.55,-168.71 341.11,-253.07 511.65,-253.07 124.71,0 215.94,34.38 273.7,103.17 57.78,68.76 78.42,162.73 61.9,281.94l-140.29 1009.58 -404.37 0 126.54 -899.54c7.34,-56.85 2.74,-96.28 -13.76,-118.28 -16.5,-22.01 -44.93,-33.01 -85.28,-33.01 -45.84,0 -94.44,14.67 -145.79,44.02 -51.36,29.33 -121.04,83.43 -209.06,162.29l-118.3 844.52 -390.61 0 123.78 -899.54c9.18,-55.03 6.42,-93.98 -8.25,-116.91 -14.67,-22.92 -44.02,-34.38 -88.02,-34.38 -47.68,0 -97.66,14.21 -149.93,42.63 -52.27,28.42 -120.57,79.32 -204.94,152.67l-118.29 855.53 -404.37 0 189.81 -1356.2 316.34 0zm3288.53 0l-187.05 1356.2 -313.6 0 0 -255.82c-201.73,194.39 -397.04,291.57 -585.93,291.57 -130.22,0 -225.11,-33.92 -284.71,-101.78 -59.61,-67.85 -80.24,-161.38 -61.9,-280.58l140.29 -1009.59 407.13 0 -129.3 899.56c-7.33,55.01 -3.21,93.97 12.4,116.92 15.58,22.91 45.38,34.36 89.4,34.36 58.67,0 115.98,-15.57 171.92,-46.76 55.93,-31.17 130.67,-86.18 224.2,-165.04l115.53 -839.04 401.62 0zm887.04 635.46l-360.36 -145.77c-137.56,-56.87 -230.16,-130.22 -277.85,-220.09 -47.68,-89.86 -63.26,-202.65 -46.76,-338.36 27.52,-201.73 97.67,-336.98 210.44,-405.74 112.79,-68.77 288.39,-103.16 526.8,-103.16 236.56,0 442.89,25.67 618.93,77.03l-41.26 283.33c-165.05,-5.51 -361.27,-8.25 -588.68,-8.25 -111.88,-1.85 -187.97,6.87 -228.32,26.14 -40.35,19.24 -66.93,71.05 -79.77,155.43 -9.17,62.33 -4.13,105.89 15.13,130.66 19.25,24.77 64.64,50.88 136.15,78.4l341.11 132.04c144.88,56.84 240.24,127.89 286.09,213.17 45.85,85.29 59.6,202.21 41.26,350.76 -27.5,209.06 -94.9,349.82 -202.17,422.25 -107.28,72.43 -289.31,108.65 -546.05,108.65 -212.73,0 -430.06,-24.75 -651.96,-74.27l44.02 -299.84c388.79,9.17 585.92,13.76 591.43,13.76 128.37,0 215.48,-12.4 261.33,-37.15 45.85,-24.74 75.19,-77.49 88.02,-158.18 7.33,-62.34 1.85,-105.43 -16.5,-129.28 -18.34,-23.84 -58.68,-47.69 -121.03,-71.53zm1478.47 -673.95c251.24,0 426.38,56.84 525.41,170.54 99.04,113.7 130.2,301.69 93.54,563.92 -34.85,254.93 -110.5,434.66 -226.94,539.18 -116.47,104.55 -297.56,156.8 -543.31,156.8 -249.4,0 -425,-56.85 -526.78,-170.55 -101.8,-113.7 -134.34,-299.85 -97.65,-558.43 36.66,-256.75 112.77,-437.82 228.31,-543.28 115.53,-105.46 298.01,-158.18 547.42,-158.18zm-2.75 305.35c-111.88,0 -192.1,28.41 -240.69,85.28 -48.61,56.83 -84.83,171.47 -108.66,343.83 -22.01,157.73 -19.26,262.28 8.24,313.62 27.51,51.34 94.45,77.02 200.82,77.02 110.04,0 188.88,-28.88 236.56,-86.65 47.7,-57.77 83.45,-170.11 107.28,-336.99 23.85,-157.71 21.56,-263.16 -6.86,-316.35 -28.42,-53.18 -94,-79.76 -196.69,-79.76zm1896.6 -594.19l-242.07 0c-71.53,0 -123.34,12.38 -155.43,37.15 -32.09,24.74 -53.63,72.88 -64.64,144.42l-19.26 145.76 371.38 0 -35.78 272.36 -376.86 0 -181.82 1418.14c-41.36,322.73 -200.15,485.68 -480.52,534.68 -79.23,13.83 -205.69,26.02 -379.06,36.48l45.22 -309.48 206.05 -50.73c83.77,-20.61 131.13,-82.25 164.96,-131.09 33.8,-48.77 58.41,-127.38 72.47,-244.11l151.07 -1253.89 -233.82 0 33.01 -258.59 239.33 -13.77 30.25 -211.79c38.52,-275.08 197.15,-412.63 475.9,-412.63 181.55,0 330.11,9.16 445.64,27.5l-66.02 269.59zm493.66 599.69l-90.77 649.19c-7.33,51.36 -3.21,85.73 12.37,103.17 15.58,17.43 50.89,26.12 105.9,26.12l181.57 0 19.25 286.09c-97.19,34.84 -223.73,52.28 -379.61,52.28 -128.37,0 -223.74,-35.31 -286.1,-105.91 -62.34,-70.61 -84.36,-168.26 -66.02,-292.98l104.55 -717.96 -228.21 0 36.84 -269.95 229.86 -2.41 55.03 -379.6 398.87 0 -52.28 379.6 374.13 0 -38.5 272.36 -376.88 0z" />
    <path className="fl1" d="M1965.05 4410.25l-126.36 -45.95c-45.95,-17.23 -77.22,-41.33 -93.82,-72.28 -16.59,-30.96 -21.7,-70.36 -15.31,-118.23 10.2,-70.2 33.82,-116.63 70.84,-139.28 37.01,-22.65 94.77,-33.99 173.27,-33.99 81.69,0 150.62,7.66 206.78,22.97l-12.44 84.26c-75.31,-2.57 -139.78,-3.84 -193.38,-3.84 -20.43,0 -34.95,0.16 -43.56,0.47 -8.61,0.33 -18.99,1.76 -31.12,4.31 -12.12,2.57 -20.73,6.71 -25.84,12.45 -5.1,5.74 -9.89,13.56 -14.36,23.45 -4.47,9.89 -7.98,22.83 -10.53,38.77 -3.83,27.44 -2.07,45.96 5.26,55.53 7.34,9.57 24.74,19.14 52.18,28.72l122.53 44.04c49.15,17.87 81.54,41.47 97.17,70.84 15.63,29.35 19.94,69.56 12.92,120.62 -9.57,72.11 -32.39,120.3 -68.44,144.55 -36.06,24.25 -97.49,36.37 -184.28,36.37 -72.76,0 -144.24,-7.34 -214.44,-22.01l13.4 -87.12c111.69,2.56 177.1,3.83 196.25,3.83 51.69,0 86.47,-5.1 104.34,-15.31 17.87,-10.22 29.04,-33.18 33.51,-68.93 3.83,-27.44 2.07,-46.11 -5.26,-56 -7.34,-9.89 -23.78,-19.31 -49.31,-28.24zm383.88 -410.69l52.65 0c11.49,0 19.95,3.2 25.37,9.57 5.42,6.39 7.5,15.01 6.22,25.85l-6.7 52.65c-3.83,21.06 -15.96,31.59 -36.37,31.59l-52.66 0c-24.25,0 -34.78,-12.12 -31.59,-36.37l7.66 -51.7c1.91,-21.06 13.72,-31.59 35.42,-31.59zm-7.66 672.99l-115.83 0 66.06 -469.08 114.87 0 -65.1 469.08z" />
    <path className="fl2" d="M4588.77 1177.76c0,4.52 0,9.34 0.27,13.87 0.26,4.81 0.53,9.33 0.53,14.13 0,4.83 -0.27,9.35 -0.53,14.14 -0.27,4.55 -0.27,9.35 -0.27,13.89l202.3 125.98 -124.1 299.43 -232.18 -53.11c-12.57,13.63 -25.63,26.69 -39.26,38.97l53.11 232.46 -299.43 124.1 -125.97 -202.29c-4.55,0 -9.35,0 -13.89,0.26 -4.8,0.26 -9.32,0.53 -14.12,0.53 -4.84,0 -9.35,-0.27 -14.16,-0.53 -4.53,-0.26 -9.34,-0.26 -13.88,-0.26l-125.98 202.29 -299.43 -124.1 53.11 -232.46c-13.62,-12.28 -26.69,-25.34 -38.97,-38.97l-232.46 53.11 -124.11 -299.43 202.3 -125.98c0,-4.54 0,-9.34 -0.27,-13.89 -0.26,-4.79 -0.53,-9.31 -0.53,-14.14 0,-4.8 0.27,-9.32 0.53,-14.13 0.27,-4.53 0.27,-9.35 0.27,-13.87l-202.3 -125.99 124.11 -299.43 232.46 53.1c12.28,-13.6 25.35,-26.68 38.97,-39.24l-53.11 -232.18 299.43 -124.11 125.98 202.3c4.54,0 9.35,0 13.88,-0.27 4.81,-0.26 9.32,-0.53 14.16,-0.53 4.8,0 9.32,0.27 14.12,0.53 4.54,0.27 9.34,0.27 13.89,0.27l125.97 -202.3 299.43 124.11 -53.11 232.18c13.63,12.56 26.69,25.64 39.26,39.24l232.18 -53.1 124.1 299.43 -202.3 125.99z" />
    <path className="fl3" d="M3995.22 1013.48c26.51,0 51.46,5.06 74.85,15.17 23.38,9.96 43.8,23.74 61.08,41.18 17.44,17.29 31.23,37.71 41.18,61.09 10.12,23.39 15.18,48.34 15.18,74.85 0,26.52 -5.06,51.48 -15.18,74.86 -9.95,23.38 -23.74,43.81 -41.18,61.09 -17.28,17.44 -37.7,31.06 -61.08,41.17 -23.39,10.13 -48.34,15.18 -74.85,15.18 -26.53,0 -51.48,-5.05 -74.87,-15.18 -23.38,-10.11 -43.79,-23.73 -61.07,-41.17 -17.45,-17.28 -31.06,-37.71 -41.19,-61.09 -10.12,-23.38 -15.18,-48.34 -15.18,-74.86 0,-26.51 5.06,-51.46 15.18,-74.85 10.13,-23.38 23.74,-43.8 41.19,-61.09 17.28,-17.44 37.69,-31.22 61.07,-41.18 23.39,-10.11 48.34,-15.17 74.87,-15.17z" />
    <path className="st0" d="M4139.59 1552.76l28.74 66.39m-321.38 -66.39l-28.74 66.39m350.12 -66.39c-9.31,21.51 -31.28,36.54 -56.74,36.54l-209.19 0c-25.45,0 -47.43,-15.03 -56.74,-36.54" />
  </svg>
);

// ─── FLOATING SHAPES (decorative background) ─────────────────────────────────
const FloatingShapes = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {/* WiFi signal top-right */}
    <svg style={{ position:'absolute', top:'6%', right:'6%', opacity:0.18, animation:'float 5s ease-in-out 0s infinite alternate' }} width="80" height="60" viewBox="0 0 80 60" fill="none">
      <path d="M40 50 L40 52" stroke="#0078BF" strokeWidth="4" strokeLinecap="round"/>
      <path d="M28 38 Q40 28 52 38" stroke="#0078BF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M18 28 Q40 12 62 28" stroke="#00ABC8" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M8 18 Q40 -4 72 18" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>

    {/* Microchip bottom-left */}
    <svg style={{ position:'absolute', bottom:'12%', left:'4%', opacity:0.15, animation:'float 6s ease-in-out 1s infinite alternate' }} width="90" height="90" viewBox="0 0 90 90" fill="none">
      <rect x="22" y="22" width="46" height="46" rx="6" stroke="#0078BF" strokeWidth="3" fill="rgba(0,120,191,0.06)"/>
      <rect x="30" y="30" width="30" height="30" rx="3" stroke="#00ABC8" strokeWidth="2" fill="rgba(0,171,200,0.08)"/>
      <line x1="22" y1="33" x2="10" y2="33" stroke="#0078BF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="45" x2="10" y2="45" stroke="#0078BF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="57" x2="10" y2="57" stroke="#0078BF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="33" x2="80" y2="33" stroke="#0078BF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="45" x2="80" y2="45" stroke="#0078BF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="57" x2="80" y2="57" stroke="#0078BF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="33" y1="22" x2="33" y2="10" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="45" y1="22" x2="45" y2="10" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="57" y1="22" x2="57" y2="10" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="33" y1="68" x2="33" y2="80" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="45" y1="68" x2="45" y2="80" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="57" y1="68" x2="57" y2="80" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>

    {/* Circuit nodes top-left */}
    <svg style={{ position:'absolute', top:'18%', left:'3%', opacity:0.14, animation:'float 4.5s ease-in-out 0.5s infinite alternate' }} width="100" height="80" viewBox="0 0 100 80" fill="none">
      <circle cx="15" cy="15" r="6" fill="#0078BF"/>
      <circle cx="50" cy="15" r="4" fill="#00ABC8"/>
      <circle cx="85" cy="40" r="6" fill="#3FAB99"/>
      <circle cx="50" cy="65" r="4" fill="#0078BF"/>
      <circle cx="15" cy="65" r="5" fill="#00ABC8"/>
      <line x1="15" y1="15" x2="50" y2="15" stroke="#0078BF" strokeWidth="2"/>
      <line x1="50" y1="15" x2="85" y2="40" stroke="#00ABC8" strokeWidth="2"/>
      <line x1="85" y1="40" x2="50" y2="65" stroke="#3FAB99" strokeWidth="2"/>
      <line x1="50" y1="65" x2="15" y2="65" stroke="#0078BF" strokeWidth="2"/>
      <line x1="15" y1="65" x2="15" y2="15" stroke="#00ABC8" strokeWidth="2"/>
    </svg>

    {/* ESP32 board right side */}
    <svg style={{ position:'absolute', top:'40%', right:'3%', opacity:0.13, animation:'float 5.5s ease-in-out 1.5s infinite alternate' }} width="70" height="110" viewBox="0 0 70 110" fill="none">
      <rect x="10" y="5" width="50" height="100" rx="5" stroke="#0078BF" strokeWidth="2.5" fill="rgba(0,120,191,0.05)"/>
      <rect x="18" y="18" width="34" height="22" rx="3" fill="rgba(0,171,200,0.15)" stroke="#00ABC8" strokeWidth="1.5"/>
      <text x="22" y="34" fontSize="8" fill="#0078BF" fontWeight="700">ESP32</text>
      {[0,1,2,3,4,5].map((i) => (
        <g key={i}>
          <line x1="10" y1={50 + i*9} x2="2" y2={50 + i*9} stroke="#3FAB99" strokeWidth="2" strokeLinecap="round"/>
          <line x1="60" y1={50 + i*9} x2="68" y2={50 + i*9} stroke="#3FAB99" strokeWidth="2" strokeLinecap="round"/>
        </g>
      ))}
      <circle cx="35" cy="85" r="6" fill="rgba(0,171,200,0.2)" stroke="#00ABC8" strokeWidth="1.5"/>
    </svg>

    {/* Blinking LED bottom-right */}
    <svg style={{ position:'absolute', bottom:'20%', right:'8%', opacity:0.2, animation:'float 4s ease-in-out 2s infinite alternate' }} width="50" height="70" viewBox="0 0 50 70" fill="none">
      <ellipse cx="25" cy="28" rx="14" ry="16" fill="rgba(176,211,90,0.25)" stroke="#B0D35A" strokeWidth="2.5"/>
      <line x1="18" y1="44" x2="18" y2="62" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="44" x2="32" y2="56" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18" y1="62" x2="14" y2="68" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="56" x2="36" y2="68" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="25" cy="22" rx="8" ry="9" fill="rgba(176,211,90,0.5)" style={{animation:'pulse 1.5s ease-in-out infinite'}}/>
    </svg>

    {/* AI brain nodes center-left */}
    <svg style={{ position:'absolute', bottom:'8%', left:'15%', opacity:0.13, animation:'float 6s ease-in-out 0.8s infinite alternate' }} width="80" height="80" viewBox="0 0 80 80" fill="none">
      {[
        [40,10],[10,30],[70,30],[20,60],[60,60],[40,75]
      ].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="5" fill="#0078BF" opacity="0.8"/>
      ))}
      <line x1="40" y1="10" x2="10" y2="30" stroke="#00ABC8" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="10" x2="70" y2="30" stroke="#00ABC8" strokeWidth="1.5" opacity="0.6"/>
      <line x1="10" y1="30" x2="20" y2="60" stroke="#3FAB99" strokeWidth="1.5" opacity="0.6"/>
      <line x1="70" y1="30" x2="60" y2="60" stroke="#3FAB99" strokeWidth="1.5" opacity="0.6"/>
      <line x1="20" y1="60" x2="40" y2="75" stroke="#0078BF" strokeWidth="1.5" opacity="0.6"/>
      <line x1="60" y1="60" x2="40" y2="75" stroke="#0078BF" strokeWidth="1.5" opacity="0.6"/>
      <line x1="10" y1="30" x2="70" y2="30" stroke="#00ABC8" strokeWidth="1" opacity="0.4"/>
      <line x1="20" y1="60" x2="60" y2="60" stroke="#3FAB99" strokeWidth="1" opacity="0.4"/>
    </svg>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
type Lang = 'en' | 'hi' | 'mr';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeGrade, setActiveGrade] = useState<number | null>(null);
  const [counts, setCounts] = useState({ students: 0, courses: 0, schools: 0, certs: 0 });
  const [hoveredFeat, setHoveredFeat] = useState<number | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const t = T[lang];

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const targets: Record<string, number> = { students: 2400, courses: 48, schools: 12, certs: 890 };
          Object.entries(targets).forEach(([k, tgt]) => {
            let v = 0;
            const step = tgt / 1500 * 16;
            const go = () => { v = Math.min(v + step, tgt); setCounts(p => ({ ...p, [k]: Math.round(v) })); if (v < tgt) requestAnimationFrame(go); };
            go();
          });
        }
      });
    }, { threshold: 0.4 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const gradeColors = ['#FF6B6B','#FF8E53','#FFC93C','#6BCB77','#4D96FF','#C77DFF','#FF6B6B','#FF8E53','#FFC93C','#6BCB77','#4D96FF','#C77DFF'];

  return (
    <div style={{ background: '#FFFFFF', color: '#0D1A2A', fontFamily: "'Nunito', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes float { from { transform: translateY(0px) scale(1); } to { transform: translateY(-20px) scale(1.05); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.1)} 80%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes blinkLED { 0%,100%{opacity:1;filter:drop-shadow(0 0 6px #B0D35A)} 50%{opacity:0.3;filter:none} }
        @keyframes dataFlow { 0%{stroke-dashoffset:100} 100%{stroke-dashoffset:0} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
        @keyframes typeIn { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes waveMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes countUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,120,191,0)} 50%{box-shadow:0 0 0 12px rgba(0,120,191,0.12)} }
        @keyframes scanLine { 0%{top:-4px} 100%{top:104%} }
        @keyframes orbit { 0%{transform:rotate(0deg) translateX(28px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
        .feat-card:hover { transform: translateY(-6px) !important; box-shadow: 0 16px 40px rgba(0,120,191,0.15) !important; border-color: #0078BF !important; }
        .grade-btn:hover { transform: translateY(-3px) scale(1.08) !important; }
        .lang-btn:hover { background: #EBF5FF !important; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,120,191,0.35) !important; }
        .nav-link:hover { background: #EBF5FF !important; color: #0078BF !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E2EDF5', padding: '0 2.5rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 16px rgba(0,120,191,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SimuSoftLogo height={36} />
          <div style={{ width: 1, height: 30, background: '#D0E4F0', margin: '0 2px' }} />
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#0078BF', lineHeight: 1 }}>SimuLearning</div>
            <div style={{ fontSize: '0.6rem', color: '#7BA8BE', letterSpacing: '0.07em', fontWeight: 700 }}>by SimuSoft Technologies</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', background: '#F0F7FF', borderRadius: 10, padding: 3, gap: 2, marginRight: 8, border: '1px solid #D0E8F5' }}>
            {(['en', 'hi', 'mr'] as Lang[]).map(l => (
              <button key={l} className="lang-btn" onClick={() => setLang(l)}
                style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.78rem', transition: 'all 0.18s', background: lang === l ? '#0078BF' : 'transparent', color: lang === l ? '#fff' : '#4A7A96' }}>
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
              </button>
            ))}
          </div>
          <Link href="/courses" className="nav-link" style={{ padding: '7px 16px', borderRadius: 9, color: '#0078BF', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s' }}>{t.exploreCourses.replace(' →', '')}</Link>
          <Link href="/login" style={{ padding: '8px 18px', borderRadius: 10, background: '#F0F7FF', color: '#0078BF', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', border: '1.5px solid #B8D9F5', transition: 'all 0.2s' }}>{(t as any).studentLogin}</Link>
          <Link href="/login?role=admin" style={{ padding: '8px 18px', borderRadius: 10, background: '#0078BF', color: '#fff', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,120,191,0.25)', transition: 'all 0.2s' }}>{t.schoolLogin}</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', background: 'linear-gradient(160deg,#EBF5FF 0%,#F0FAFA 55%,#FFFFFF 100%)', padding: '88px 2rem 72px', textAlign: 'center', overflow: 'hidden' }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', animation: 'fadeUp 0.7s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#DBEEFF', borderRadius: 999, padding: '7px 20px', fontSize: '0.78rem', fontWeight: 800, color: '#0078BF', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28, border: '1px solid #B8D9F5' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ABC8', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            {t.tagline}
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.9rem,5vw,3.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 18, color: '#0D1A2A', letterSpacing: '-0.01em' }}>
            <span style={{ display:'block', marginBottom: 4 }}>{t.hero1}{' '}
              <span style={{ background: 'linear-gradient(135deg,#0078BF,#00ABC8,#3FAB99)', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradShift 4s ease infinite' }}>
                {t.hero2}
              </span>
            </span>
            <span style={{ display:'block', fontSize:'60%', fontWeight:700, color:'#4A7A96', letterSpacing:'0.02em', marginTop:6 }}>{t.hero3}</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#4A7A96', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.75 }}>{t.heroSub}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="cta-btn" style={{ padding: '14px 28px', borderRadius: 14, background: 'linear-gradient(135deg,#0078BF,#00ABC8)', color: '#fff', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 6px 20px rgba(0,120,191,0.3)', display: 'inline-flex', alignItems:'center', gap:8, transition: 'all 0.2s' }}><span>🎓</span>{(t as any).studentLogin}</Link>
            <Link href="/login?role=admin" className="cta-btn" style={{ padding: '14px 28px', borderRadius: 14, background: '#fff', color: '#0078BF', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', border: '2px solid #0078BF', display: 'inline-flex', alignItems:'center', gap:8, transition: 'all 0.2s' }}><span>🏫</span>{t.schoolLogin}</Link>
            <Link href="/courses" className="cta-btn" style={{ padding: '14px 28px', borderRadius: 14, background: 'transparent', color: '#4A7A96', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', border: '1.5px solid #D0E4F0', display: 'inline-flex', alignItems:'center', gap:8, transition: 'all 0.2s' }}><span>📚</span>{t.exploreCourses}</Link>
          </div>
          {/* floating grade badges */}
          <div style={{ marginTop: 52, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', opacity: 0.75 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
              <div key={g} style={{ width: 36, height: 36, borderRadius: 10, background: gradeColors[g - 1] + '22', border: `1.5px solid ${gradeColors[g - 1]}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: gradeColors[g - 1], animation: `float ${3 + g * 0.3}s ease-in-out ${g * 0.15}s infinite alternate` }}>
                {g}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURE TICKER ── */}
      <div style={{ background: '#0078BF', padding: '12px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 0, animation: 'waveMove 22s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...Array(2)].map((_,ri) => (
            <div key={ri} style={{ display: 'flex', gap: 0 }}>
              {['🔬 Virtual IoT Labs', '🏆 Gamified Badges', '📜 Verified Certificates', '🧠 Smart Quizzes', '🌐 English · हिंदी · मराठी', '📊 Teacher Analytics', '🎓 Grade 1–12', '⚡ ESP32 & Arduino', '🤖 AI & Machine Learning', '📡 MQTT & Cloud IoT'].map((item, i) => (
                <span key={i} style={{ padding: '0 32px', fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {item} <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── GRADE PICKER ── */}
      <div style={{ padding: '72px 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, color: '#0D1A2A' }}>{t.gradeTitle}</h2>
          <p style={{ color: '#4A7A96', fontSize: '0.9rem', marginBottom: 36 }}>{t.gradeSub}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
              <button key={g} className="grade-btn" onClick={() => setActiveGrade(g === activeGrade ? null : g)}
                style={{ width: 64, height: 64, borderRadius: 16, border: `2px solid ${activeGrade === g ? gradeColors[g - 1] : '#E2EDF5'}`, background: activeGrade === g ? gradeColors[g - 1] + '18' : '#F8FBFF', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: activeGrade === g ? `0 4px 18px ${gradeColors[g - 1]}40` : 'none' }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.15rem', color: activeGrade === g ? gradeColors[g - 1] : '#2A4A5E', lineHeight: 1 }}>{g}</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, color: activeGrade === g ? gradeColors[g - 1] : '#7BA8BE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.grade}</span>
              </button>
            ))}
          </div>
          {activeGrade && (t.grades as any)[activeGrade] && (
            <div style={{ background: `linear-gradient(135deg,${gradeColors[activeGrade - 1]}10,#EBF5FF)`, border: `1.5px solid ${gradeColors[activeGrade - 1]}40`, borderRadius: 20, padding: '26px 30px', textAlign: 'left', animation: 'slideIn 0.25s ease' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: gradeColors[activeGrade - 1], marginBottom: 8 }}>{(t.grades as any)[activeGrade].title}</h3>
              <p style={{ color: '#2A4A5E', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 14 }}>{(t.grades as any)[activeGrade].desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(t.grades as any)[activeGrade].topics.map((tp: string) => (
                  <span key={tp} style={{ background: '#fff', border: `1px solid ${gradeColors[activeGrade - 1]}55`, padding: '5px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, color: gradeColors[activeGrade - 1] }}>{tp}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding: '0 2rem 80px', background: '#F4F9FF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '64px 0 44px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, color: '#0D1A2A' }}>{t.featTitle}</h2>
            <p style={{ color: '#4A7A96', fontSize: '0.9rem' }}>{t.featSub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 18 }}>
            {t.features.map((f, i) => (
              <div key={i} className="feat-card"
                onMouseEnter={() => setHoveredFeat(i)} onMouseLeave={() => setHoveredFeat(null)}
                style={{ background: '#fff', border: `1.5px solid ${hoveredFeat === i ? '#0078BF' : '#D0E8F5'}`, borderRadius: 20, padding: '28px', transition: 'all 0.25s', cursor: 'default', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: hoveredFeat === i ? '#EBF5FF' : '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 16, transition: 'all 0.25s', transform: hoveredFeat === i ? 'scale(1.15) rotate(-5deg)' : 'none', animation: hoveredFeat === i ? 'glowPulse 1s ease infinite' : 'none' }}>{f.icon}</div>
                <div style={{ position:'absolute', top:16, right:16, width:8, height:8, borderRadius:'50%', background: hoveredFeat === i ? '#00ABC8' : '#D0E8F5', transition:'all 0.3s', boxShadow: hoveredFeat === i ? '0 0 0 4px rgba(0,171,200,0.2)' : 'none' }}/>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.02rem', marginBottom: 8, color: '#0D1A2A' }}>{f.title}</div>
                <div style={{ color: '#4A7A96', fontSize: '0.86rem', lineHeight: 1.65 }}>{f.desc}</div>
                {hoveredFeat === i && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#0078BF,#00ABC8)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div ref={statsRef} style={{ background: 'linear-gradient(135deg,#0078BF,#005A8E)', padding: '64px 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }}>
          {[
            { k: 'students', label: t.statsStudents, suffix: '+' },
            { k: 'courses', label: t.statsCourses, suffix: '' },
            { k: 'schools', label: t.statsSchools, suffix: '' },
            { k: 'certs', label: t.statsCerts, suffix: '+' },
          ].map(s => (
            <div key={s.k} style={{ padding: '16px 8px' }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {(counts as any)[s.k].toLocaleString()}{s.suffix}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: '80px 2rem', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, color: '#0D1A2A' }}>{t.howTitle}</h2>
          <p style={{ color: '#4A7A96', fontSize: '0.9rem', marginBottom: 56 }}>{t.howSub}</p>
          <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 27, left: '16.5%', right: '16.5%', height: 2, background: 'linear-gradient(90deg,#0078BF,#00ABC8,#3FAB99)', zIndex: 0 }} />
            {[
              { n: 1, title: t.step1t, desc: t.step1d, emoji: '🏫' },
              { n: 2, title: t.step2t, desc: t.step2d, emoji: '📚' },
              { n: 3, title: t.step3t, desc: t.step3d, emoji: '🎓' },
            ].map(s => (
              <div key={s.n} style={{ flex: 1, padding: '0 16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#0078BF,#00ABC8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 18px', boxShadow: '0 6px 18px rgba(0,120,191,0.25)' }}>{s.emoji}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.95rem', marginBottom: 6, color: '#0D1A2A' }}>{s.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#4A7A96', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: 'linear-gradient(135deg,#0078BF,#00ABC8)', padding: '80px 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚀</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.6rem,4vw,2.1rem)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>{t.ctaTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginBottom: 36, lineHeight: 1.7 }}>{t.ctaSub}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginTop: 22 }}>{t.studentNote}</p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0D1A2A', padding: '36px 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SimuSoftLogo height={28} />
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>SimuLearning</div>
            <div style={{ fontSize: '0.6rem', color: '#4A7A96', letterSpacing: '0.06em' }}>{t.by}</div>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#4A7A96' }}>AI & IoT Education for Indian Schools — Grade 1 to 12 🇮🇳</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {([[t.exploreCourses.replace(' →', ''), '/courses'], [t.schoolLogin, '/login'], ['Admin', '/admin-login']] as [string, string][]).map(([label, href]) => (
            <Link key={href} href={href} style={{ color: '#4A7A96', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
