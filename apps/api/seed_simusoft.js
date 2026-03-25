/**
 * IoTLMS — SimuSoft AI Courses Seed
 * 6 courses × 3 languages (EN / MR / HI) from Karmaveer / SimuSoft Technologies
 *
 * Run from apps/api/:
 *   node seed_simusoft.js
 *
 * Prerequisites:
 *   - node seed.js already run (tenant + users must exist)
 *   - npx prisma migrate dev --name add_course_content_fields already run
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TENANT_SLUG = 'greenfield';
const CREATED_BY  = 'school-admin-fixed-id-002';

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DATA
// Each course has: meta + modules[] → lessons[]
// lesson.type: 'video' | 'quiz' | 'lab' (maps to existing schema)
// lesson.content_url: YouTube embed URL — fill in after getting playlist links
// ─────────────────────────────────────────────────────────────────────────────

const COURSES = [

  // ── COURSE 1: Std 5-6 ──────────────────────────────────────────────────────
  {
    id: 'course-ai-std5-6',
    slug: 'ai-sobat-majja-std-5-6',
    title_en: 'AI Fun for Kids – Standard 5 & 6',
    title_mr: 'AI सोबत मज्जा! – इयत्ता ५ वी आणि ६ वी',
    title_hi: 'AI के साथ मज़ा! – कक्षा ५ और ६',
    description_en: 'A fun introduction to AI for Class 5 & 6 students. Learn about AI in daily life, robots, smart farming, and create your own AI art and music!',
    description_mr: 'इयत्ता ५ वी व ६ वी च्या विद्यार्थ्यांसाठी AI ची मजेदार ओळख. दैनंदिन जीवनातील AI, रोबोट्स आणि स्वतःची AI कला तयार करायला शिका!',
    description_hi: 'कक्षा ५ और ६ के लिए AI का मज़ेदार परिचय। रोज़ की ज़िंदगी में AI, रोबोट, स्मार्ट खेती और AI आर्ट बनाना सीखें!',
    category: 'Artificial Intelligence',
    level: 'beginner',
    duration_hours: 8,
    price: 0,
    target_grade: '5-6',
    stream: 'GENERAL',
    playlist_url: 'https://www.youtube.com/playlist?list=REPLACE_PLAYLIST_5_6',
    tags_json: ['AI Basics', 'Robots', 'Smart Farming', 'Kids', 'Teachable Machine'],
    thumbnail_url: '/assets/courses/ai-sobat-majja.jpg',
    status: 'published',
    lessons: [
      // Chapter 1
      { id: 'l-56-01', title: 'What is AI?', title_hi: 'AI क्या है?', title_mr: 'AI म्हणजे काय?', description: 'Introduction to Artificial Intelligence — what it is and how it thinks.', type: 'video', order_index: 1, duration_min: 10, is_preview: true,  content_url: null },
      { id: 'l-56-02', title: 'Where Do We See AI?', title_hi: 'AI कहाँ दिखती है?', title_mr: 'AI कुठे दिसते?', description: 'Discover AI all around you — at home, school, and in nature.', type: 'video', order_index: 2, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-03', title: 'AI is Everywhere!', title_hi: 'AI हर जगह है!', title_mr: 'AI सर्वत्र आहे!', description: 'AI surrounds us — from voice assistants to recommendation systems.', type: 'video', order_index: 3, duration_min: 8,  is_preview: false, content_url: null },
      { id: 'l-56-04', title: 'AI in Daily Life', title_hi: 'दैनिक जीवन में AI', title_mr: 'दैनंदिन जीवनात AI', description: 'How AI makes our everyday life easier and more fun.', type: 'video', order_index: 4, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-05', title: 'AI in Nature & Farming!', title_hi: 'प्रकृति और खेती में AI!', title_mr: 'निसर्ग आणि शेतीतील AI!', description: 'See how AI is helping farmers grow better crops and protect nature.', type: 'video', order_index: 5, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-56-06', title: 'Chapter 1 Quiz', title_hi: 'अध्याय १ प्रश्नोत्तरी', title_mr: 'प्रकरण १ प्रश्नमंजुषा', description: 'Test your understanding of AI basics.', type: 'quiz', order_index: 6, duration_min: 10, is_preview: false, content_url: null },
      // Chapter 2
      { id: 'l-56-07', title: 'AI Learns Like Us!', title_hi: 'AI हमारी तरह सीखती है!', title_mr: 'AI आपल्यासारखं शिकतं!', description: 'Understand how AI learns from examples — just like you learned to read!', type: 'video', order_index: 7, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-56-08', title: 'AI vs Machine Learning vs Robots', title_hi: 'AI बनाम ML बनाम रोबोट', title_mr: 'AI vs. मशीन लर्निंग vs. रोबोट्स', description: 'What is the difference between AI, Machine Learning, and Robots?', type: 'video', order_index: 8, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-56-09', title: 'Chapter 2 Quiz', title_hi: 'अध्याय २ प्रश्नोत्तरी', title_mr: 'प्रकरण २ प्रश्नमंजुषा', description: 'Quiz on how AI learns.', type: 'quiz', order_index: 9, duration_min: 8, is_preview: false, content_url: null },
      // Chapter 3
      { id: 'l-56-10', title: 'Self-Driving Cars – How Do They Work?', title_hi: 'सेल्फ-ड्राइविंग कार', title_mr: 'स्वयंचलित गाड्या', description: 'Explore how AI powers self-driving cars.', type: 'video', order_index: 10, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-56-11', title: 'Talking Robots – Meet Sophia!', title_hi: 'बोलने वाले रोबोट — सोफिया', title_mr: 'बोलणारा रोबोट — सोफिया', description: 'Meet Sophia the Robot and learn about AI-powered machines.', type: 'video', order_index: 11, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-12', title: 'AI Helps Farmers!', title_hi: 'AI किसानों की मदद करती है!', title_mr: 'AI शेतकऱ्यांना कशी मदत करतो?', description: 'Discover AI tools that are transforming agriculture.', type: 'video', order_index: 12, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-13', title: 'AI Apps That Detect Plant Diseases', title_hi: 'पौधों की बीमारी पहचानने वाले ऐप्स', title_mr: 'वनस्पती रोग शोधणारे AI अ‍ॅप्स', description: 'Apps that use AI to identify plant diseases from photos.', type: 'video', order_index: 13, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-14', title: 'AI Smart Irrigation – Saving Water!', title_hi: 'स्मार्ट सिंचाई — पानी बचाओ!', title_mr: 'स्मार्ट सिंचन — पाणी वाचवा!', description: 'How AI optimizes water usage in farming.', type: 'video', order_index: 14, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-15', title: 'Chapter 3 Quiz', title_hi: 'अध्याय ३ प्रश्नोत्तरी', title_mr: 'प्रकरण ३ प्रश्नमंजुषा', description: 'Quiz on AI and robots.', type: 'quiz', order_index: 15, duration_min: 8, is_preview: false, content_url: null },
      // Chapter 4
      { id: 'l-56-16', title: "Let's Play With AI", title_hi: 'AI के साथ खेलते हैं', title_mr: 'AI सोबत खेळूया', description: 'Fun interactive activities using AI tools online.', type: 'lab', order_index: 16, duration_min: 15, is_preview: true,  content_url: null },
      { id: 'l-56-17', title: 'Teachable Machine – Train an AI!', title_hi: 'Teachable Machine से AI ट्रेन करो!', title_mr: 'Teachable Machine – AI ला शिकवा!', description: "Use Google's Teachable Machine to train your own AI model.", type: 'lab', order_index: 17, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-56-18', title: 'AI Music Magic – Listen to AI Music!', title_hi: 'AI संगीत जादू!', title_mr: 'AI म्युझिक मॅजिक!', description: 'Explore AI-generated music and create your own beats.', type: 'lab', order_index: 18, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-56-19', title: 'AI Drawing Fun – Let AI Finish Your Drawings!', title_hi: 'AI ड्राइंग मज़ा!', title_mr: 'AI ड्रॉइंग फन!', description: 'Use AI drawing tools like AutoDraw to complete your sketches.', type: 'lab', order_index: 19, duration_min: 15, is_preview: false, content_url: null },
      // Chapter 5
      { id: 'l-56-20', title: 'How AI is Changing the World', title_hi: 'AI दुनिया कैसे बदल रही है?', title_mr: 'AI कसे जग बदलत आहे?', description: 'Real-world examples of AI transforming industries and lives.', type: 'video', order_index: 20, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-56-21', title: 'AI in the Future', title_hi: 'भविष्य में AI', title_mr: 'भविष्यामध्ये AI', description: 'What will the world look like with advanced AI in 10–20 years?', type: 'video', order_index: 21, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-56-22', title: 'Ethical AI: Can AI be Good or Bad?', title_hi: 'नैतिक AI: अच्छी या बुरी?', title_mr: 'AI आणि नैतिकता', description: "Explore the ethics of AI — what makes AI beneficial vs. harmful.", type: 'video', order_index: 22, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-56-23', title: 'Final Quiz – Chapter 5', title_hi: 'अंतिम प्रश्नोत्तरी', title_mr: 'अंतिम प्रश्नमंजुषा', description: 'Final assessment for the course.', type: 'quiz', order_index: 23, duration_min: 15, is_preview: false, content_url: null },
    ],
  },

  // ── COURSE 2: Std 7-8 ──────────────────────────────────────────────────────
  {
    id: 'course-ai-std7-8',
    slug: 'ai-samasyancha-samadhan-std-7-8',
    title_en: 'AI Problem Solving – Standard 7 & 8',
    title_mr: 'AI – समस्यांचे समाधान! – इयत्ता ७ वी आणि ८ वी',
    title_hi: 'AI – समस्याओं का समाधान! – कक्षा ७ और ८',
    description_en: 'Explore how AI solves real-world problems. Learn ML basics, compare AI vs humans, and start coding with Scratch.',
    description_mr: 'AI वास्तविक जगातील समस्या कशा सोडवते ते एक्सप्लोर करा. ML मूलभूत गोष्टी शिका आणि Scratch सह कोडिंग सुरू करा.',
    description_hi: 'जानें AI वास्तविक समस्याओं को कैसे हल करती है। ML की बुनियाद, AI बनाम इंसान और Scratch से कोडिंग सीखें।',
    category: 'Artificial Intelligence',
    level: 'beginner',
    duration_hours: 14,
    price: 0,
    target_grade: '7-8',
    stream: 'GENERAL',
    playlist_url: 'https://www.youtube.com/playlist?list=REPLACE_PLAYLIST_7_8',
    tags_json: ['AI vs Humans', 'Machine Learning', 'Scratch', 'Ethics', 'Coding'],
    thumbnail_url: '/assets/courses/ai-samasya.jpg',
    status: 'published',
    lessons: [
      { id: 'l-78-01', title: 'AI in Schools & Learning!', title_hi: 'स्कूलों में AI!', title_mr: 'शाळांमध्ये AI!', description: 'How AI is being used in education and learning environments.', type: 'video', order_index: 1, duration_min: 12, is_preview: true, content_url: null },
      { id: 'l-78-02', title: 'AI vs Humans – What\'s the Difference?', title_hi: 'AI बनाम इंसान', title_mr: 'AI vs. माणसांमधील फरक', description: 'A deep dive into how human intelligence differs from AI.', type: 'video', order_index: 2, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-78-03', title: 'Chapter 1 Quiz', title_hi: 'अध्याय १ प्रश्नोत्तरी', title_mr: 'प्रकरण १ प्रश्नमंजुषा', description: 'Quiz: AI vs Humans.', type: 'quiz', order_index: 3, duration_min: 8, is_preview: false, content_url: null },
      { id: 'l-78-04', title: 'Benefits and Risks of AI in Daily Life', title_hi: 'AI के फायदे और नुकसान', title_mr: 'दैनंदिन जीवनातील AI चे फायदे आणि जोखीम', description: 'Explore the positive impact and dangers of AI.', type: 'video', order_index: 4, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-78-05', title: 'AI for a Better Future!', title_hi: 'बेहतर भविष्य के लिए AI!', title_mr: 'AI चा उपयोग चांगल्या भविष्यासाठी!', description: 'How can we use AI responsibly to build a better world?', type: 'video', order_index: 5, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-78-06', title: 'Fun AI Activities & Challenges!', title_hi: 'मज़ेदार AI गतिविधियाँ!', title_mr: 'मजेदार AI क्रियाकलाप!', description: 'Hands-on challenges to experience AI tools first-hand.', type: 'lab', order_index: 6, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-78-07', title: 'Digital Safety & Responsible AI Use', title_hi: 'डिजिटल सुरक्षा', title_mr: 'डिजिटल सुरक्षा आणि जबाबदार AI', description: 'How to stay safe online and use AI ethically.', type: 'video', order_index: 7, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-78-08', title: 'Chapter 2 Quiz', title_hi: 'अध्याय २ प्रश्नोत्तरी', title_mr: 'प्रकरण २ प्रश्नमंजुषा', description: 'Quiz on Good vs Bad AI.', type: 'quiz', order_index: 8, duration_min: 8, is_preview: false, content_url: null },
      { id: 'l-78-09', title: 'What is AI? (Deep Dive)', title_hi: 'AI क्या है? (गहन)', title_mr: 'AI काय आहे? (सखोल)', description: 'A comprehensive definition of AI for Class 7-8.', type: 'video', order_index: 9, duration_min: 10, is_preview: true, content_url: null },
      { id: 'l-78-10', title: 'History and Evolution of AI', title_hi: 'AI का इतिहास', title_mr: 'AI चा इतिहास', description: 'Timeline of AI from the 1950s to today.', type: 'video', order_index: 10, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-78-11', title: 'How AI Learns from Data (ML Basics)', title_hi: 'AI डेटा से कैसे सीखती है', title_mr: 'AI डेटामधून कसे शिकते?', description: 'Introduction to Machine Learning — patterns, data, and predictions.', type: 'video', order_index: 11, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-78-12', title: 'How AI Predicts Things', title_hi: 'AI चीजें कैसे predict करती है?', title_mr: 'AI गोष्टींचा अंदाज कसा घेतो?', description: 'Understanding prediction models — weather, recommendations, and more.', type: 'video', order_index: 12, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-78-13', title: 'AI & Smart Farming', title_hi: 'AI और स्मार्ट खेती', title_mr: 'AI आणि स्मार्ट शेती', description: 'Advanced AI applications in modern agriculture.', type: 'video', order_index: 13, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-78-14', title: 'Chapter 3 Quiz', title_hi: 'अध्याय ३ प्रश्नोत्तरी', title_mr: 'प्रकरण ३ प्रश्नमंजुषा', description: 'Quiz on AI fundamentals.', type: 'quiz', order_index: 14, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-78-15', title: 'What is Machine Learning (ML)?', title_hi: 'मशीन लर्निंग क्या है?', title_mr: 'मशीन लर्निंग म्हणजे काय?', description: 'A beginner-friendly introduction to Machine Learning.', type: 'video', order_index: 15, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-78-16', title: 'Types of Machine Learning', title_hi: 'मशीन लर्निंग के प्रकार', title_mr: 'मशीन लर्निंगचे प्रकार', description: 'Supervised, unsupervised, and reinforcement learning explained.', type: 'video', order_index: 16, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-78-17', title: 'Understanding Data and Patterns in AI', title_hi: 'AI में डेटा और पैटर्न', title_mr: 'AI मध्ये डेटा आणि पॅटर्न्स', description: 'How AI finds patterns in data to make intelligent decisions.', type: 'video', order_index: 17, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-78-18', title: 'Chapter 4 Quiz', title_hi: 'अध्याय ४ प्रश्नोत्तरी', title_mr: 'प्रकरण ४ प्रश्नमंजुषा', description: 'Quiz on ML basics.', type: 'quiz', order_index: 18, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-78-19', title: 'What is Scratch?', title_hi: 'Scratch क्या है?', title_mr: 'स्क्रॅच म्हणजे काय?', description: "Introduction to MIT's Scratch programming environment.", type: 'video', order_index: 19, duration_min: 10, is_preview: true, content_url: null },
      { id: 'l-78-20', title: 'Getting Started with Scratch', title_hi: 'Scratch शुरू करना', title_mr: 'स्क्रॅच सुरू करताना', description: 'Your first Scratch project — sprites, stages, and events.', type: 'lab', order_index: 20, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-78-21', title: 'AI Concepts Using Scratch', title_hi: 'Scratch से AI अवधारणाएँ', title_mr: 'स्क्रॅचमधील AI सकल्पना', description: 'Implementing simple AI concepts through Scratch projects.', type: 'lab', order_index: 21, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-78-22', title: 'Hands-on AI Project with Scratch', title_hi: 'Scratch AI प्रोजेक्ट', title_mr: 'Scratch मध्ये AI प्रकल्प', description: 'Build a complete AI-powered Scratch project!', type: 'lab', order_index: 22, duration_min: 30, is_preview: false, content_url: null },
      { id: 'l-78-23', title: 'Final Quiz – Scratch & AI', title_hi: 'अंतिम प्रश्नोत्तरी', title_mr: 'अंतिम प्रश्नमंजुषा', description: 'Final assessment for the Scratch AI course.', type: 'quiz', order_index: 23, duration_min: 15, is_preview: false, content_url: null },
    ],
  },

  // ── COURSE 3: Std 9-10 ─────────────────────────────────────────────────────
  {
    id: 'course-ai-std9-10',
    slug: 'ai-chi-olakh-std-9-10',
    title_en: 'Understanding AI – Standard 9 & 10',
    title_mr: 'AI ची ओळख – इयत्ता ९ वी आणि १० वी',
    title_hi: 'AI को समझना – कक्षा ९ और १०',
    description_en: 'From AI fundamentals to the AI project cycle and Python programming. Build your first AI decision-making program.',
    description_mr: 'AI मूलभूत तत्त्वांपासून AI प्रकल्प सायकल आणि Python प्रोग्रामिंगपर्यंत. तुमचा पहिला AI निर्णय घेणारा प्रोग्राम तयार करा.',
    description_hi: 'AI की बुनियाद से AI प्रोजेक्ट साइकल और Python तक। कोड से अपना पहला AI प्रोग्राम बनाएं।',
    category: 'Artificial Intelligence',
    level: 'intermediate',
    duration_hours: 16,
    price: 0,
    target_grade: '9-10',
    stream: 'GENERAL',
    playlist_url: 'https://www.youtube.com/playlist?list=REPLACE_PLAYLIST_9_10',
    tags_json: ['Python', 'AI Project Cycle', 'Machine Learning', 'Decision Making', 'Coding'],
    thumbnail_url: '/assets/courses/ai-chi-olakh.jpg',
    status: 'published',
    lessons: [
      { id: 'l-910-01', title: 'How Does AI Process Information?', title_hi: 'AI जानकारी कैसे प्रोसेस करती है?', title_mr: 'AI माहिती कशी प्रक्रिया करतो?', description: 'Neural pathways, data flows, and how AI processes input into output.', type: 'video', order_index: 1, duration_min: 15, is_preview: true, content_url: null },
      { id: 'l-910-02', title: 'Training Data, Features, and Labels', title_hi: 'ट्रेनिंग डेटा, फीचर और लेबल', title_mr: 'प्रशिक्षण डेटा, वैशिष्ट्ये, आणि लेबल्स', description: 'The building blocks of every ML model.', type: 'video', order_index: 2, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-910-03', title: 'AI Learning Methods', title_hi: 'AI के सीखने के तरीके', title_mr: 'AI शिकण्याच्या पद्धती', description: 'Supervised, unsupervised, and reinforcement learning at Class 9-10 level.', type: 'video', order_index: 3, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-910-04', title: 'How AI Learns to Make Decisions', title_hi: 'AI निर्णय लेना कैसे सीखती है?', title_mr: 'AI कसा निर्णय घेणे शिकतो?', description: 'Decision trees, rules, and model training for Class 9-10.', type: 'video', order_index: 4, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-910-05', title: 'How AI Predicts the Future', title_hi: 'AI भविष्य का अनुमान कैसे लगाती है?', title_mr: 'AI भविष्याचा अंदाज कसा लावतो?', description: 'Predictive models, regression, and forecasting basics.', type: 'video', order_index: 5, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-910-06', title: 'Chapter 1 Quiz', title_hi: 'अध्याय १ प्रश्नोत्तरी', title_mr: 'प्रकरण १ प्रश्नमंजुषा', description: 'Quiz on how AI thinks and learns.', type: 'quiz', order_index: 6, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-910-07', title: 'What is the AI Project Cycle?', title_hi: 'AI प्रोजेक्ट साइकल क्या है?', title_mr: 'AI प्रोजेक्ट सायकल म्हणजे काय?', description: 'The 6-step process of building an AI project.', type: 'video', order_index: 7, duration_min: 15, is_preview: true, content_url: null },
      { id: 'l-910-08', title: 'Why Do We Need the AI Project Cycle?', title_hi: 'AI प्रोजेक्ट साइकल क्यों जरूरी है?', title_mr: 'AI प्रोजेक्ट सायकलची आवश्यकता', description: 'Real-world cases where AI projects succeeded or failed based on process.', type: 'video', order_index: 8, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-910-09', title: 'AI Cycle Mapping for Real-Life Problems', title_hi: 'वास्तविक समस्याओं के लिए AI मैपिंग', title_mr: 'वास्तविक जीवनातील समस्यांसाठी AI मॅपिंग', description: 'Apply the AI project cycle to solve a real-world problem of your choice.', type: 'lab', order_index: 9, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-910-10', title: 'Chapter 2 & 3 Quiz', title_hi: 'अध्याय २ और ३ प्रश्नोत्तरी', title_mr: 'प्रकरण २ आणि ३ प्रश्नमंजुषा', description: 'Quiz on AI Project Cycle.', type: 'quiz', order_index: 10, duration_min: 8, is_preview: false, content_url: null },
      { id: 'l-910-11', title: 'Why Python is Used for AI?', title_hi: 'AI के लिए Python क्यों?', title_mr: 'AI साठी Python का?', description: "Python's simplicity, libraries, and community make it the #1 AI language.", type: 'video', order_index: 11, duration_min: 10, is_preview: true, content_url: null },
      { id: 'l-910-12', title: 'Setting Up Python for AI', title_hi: 'AI के लिए Python सेटअप', title_mr: 'AI साठी Python सेटअप', description: 'Install Python, pip, and your first AI-ready environment.', type: 'lab', order_index: 12, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-910-13', title: 'Python Basics: Variables, Data Types & Input', title_hi: 'Python बेसिक्स', title_mr: 'Python मूलतत्त्वे', description: 'Write your first Python code — variables, data types, print and input.', type: 'lab', order_index: 13, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-910-14', title: 'Python for AI Decision-Making', title_hi: 'AI निर्णय के लिए Python', title_mr: 'AI निर्णयासाठी Python', description: 'If/else statements and logic — teach a computer to decide.', type: 'lab', order_index: 14, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-910-15', title: 'Build: Simple AI Decision Program', title_hi: 'AI प्रोग्राम बनाओ', title_mr: 'AI निर्णय प्रोग्राम तयार करा', description: 'Write a complete mini-program that uses Python to simulate AI decisions.', type: 'lab', order_index: 15, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-910-16', title: 'Final Quiz – Python for AI', title_hi: 'अंतिम प्रश्नोत्तरी', title_mr: 'अंतिम प्रश्नमंजुषा', description: 'Final assessment: Python for AI.', type: 'quiz', order_index: 16, duration_min: 15, is_preview: false, content_url: null },
    ],
  },

  // ── COURSE 4: Std 11-12 Science ────────────────────────────────────────────
  {
    id: 'course-ai-std11-12',
    slug: 'advanced-ai-std-11-12',
    title_en: 'Advanced AI – Standard 11 & 12',
    title_mr: 'ॲडव्हान्सड AI – इयत्ता ११ वी आणि १२ वी',
    title_hi: 'एडवांस्ड AI – कक्षा ११ और १२',
    description_en: 'Deep dive into ML, Deep Learning, Neural Networks, Computer Vision, and NLP. Build real AI projects using TensorFlow, Keras, and Python.',
    description_mr: 'ML, डीप लर्निंग, न्यूरल नेटवर्क्स, कॉम्प्युटर व्हिजन आणि NLP चा सखोल अभ्यास. TensorFlow, Keras आणि Python वापरून वास्तविक AI प्रोजेक्ट तयार करा.',
    description_hi: 'ML, डीप लर्निंग, न्यूरल नेटवर्क, कंप्यूटर विज़न और NLP में गहरा अध्ययन। TensorFlow, Keras से असली AI प्रोजेक्ट बनाएं।',
    category: 'Artificial Intelligence',
    level: 'advanced',
    duration_hours: 24,
    price: 0,
    target_grade: '11-12',
    stream: 'SCIENCE',
    playlist_url: 'https://www.youtube.com/playlist?list=REPLACE_PLAYLIST_11_12',
    tags_json: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP', 'TensorFlow', 'Python'],
    thumbnail_url: '/assets/courses/advanced-ai.jpg',
    status: 'published',
    lessons: [
      { id: 'l-1112-01', title: 'AI in Real Life – What is AI Used For?', title_hi: 'वास्तविक जीवन में AI', title_mr: 'वास्तविक जीवनातील AI', description: 'Real-world AI applications in healthcare, finance, education.', type: 'video', order_index: 1, duration_min: 15, is_preview: true, content_url: null },
      { id: 'l-1112-02', title: 'Types of AI: ANI, AGI, ASI', title_hi: 'AI के प्रकार: ANI, AGI, ASI', title_mr: 'AI चे प्रकार: ANI, AGI, ASI', description: 'Understanding the spectrum of AI intelligence.', type: 'video', order_index: 2, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-1112-03', title: 'AI for Social Good', title_hi: 'सामाजिक भलाई के लिए AI', title_mr: 'AI समाजिक भल्यासाठी', description: 'AI helping with climate change, poverty, and healthcare access.', type: 'video', order_index: 3, duration_min: 12, is_preview: false, content_url: null },
      { id: 'l-1112-04', title: 'Ethical AI: Bias, Privacy & Accountability', title_hi: 'नैतिक AI: पक्षपात और जवाबदेही', title_mr: 'नैतिक AI: पक्षपात आणि जबाबदारी', description: 'Bias, fairness, privacy, and accountability in AI systems.', type: 'video', order_index: 4, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-1112-05', title: 'Chapter 1 Quiz', title_hi: 'अध्याय १ प्रश्नोत्तरी', title_mr: 'प्रकरण १ प्रश्नमंजुषा', description: 'Quiz on AI concepts and applications.', type: 'quiz', order_index: 5, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-1112-06', title: 'What is Machine Learning (ML)?', title_hi: 'मशीन लर्निंग (ML) क्या है?', title_mr: 'मशीन लर्निंग (ML) काय आहे?', description: 'A thorough exploration of ML — algorithms, training, evaluation.', type: 'video', order_index: 6, duration_min: 20, is_preview: true, content_url: null },
      { id: 'l-1112-07', title: 'Real-Life ML Applications', title_hi: 'वास्तविक ML अनुप्रयोग', title_mr: 'वास्तविक जीवनातील ML प्रयोग', description: 'Spam filters, recommendation engines, fraud detection.', type: 'video', order_index: 7, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-1112-08', title: 'ML Libraries in Python: scikit-learn, pandas, numpy', title_hi: 'Python ML लाइब्रेरी', title_mr: 'Python मध्ये ML लायब्ररी', description: 'Hands-on with scikit-learn, pandas, and numpy.', type: 'lab', order_index: 8, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-1112-09', title: 'Chapter 2 Quiz', title_hi: 'अध्याय २ प्रश्नोत्तरी', title_mr: 'प्रकरण २ प्रश्नमंजुषा', description: 'Quiz on ML and AI training.', type: 'quiz', order_index: 9, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-1112-10', title: 'What is Deep Learning?', title_hi: 'डीप लर्निंग क्या है?', title_mr: 'डीप लर्निंग म्हणजे काय?', description: 'How deep learning differs from traditional ML — layers and backpropagation.', type: 'video', order_index: 10, duration_min: 20, is_preview: true, content_url: null },
      { id: 'l-1112-11', title: 'How Neural Networks Work', title_hi: 'न्यूरल नेटवर्क कैसे काम करते हैं?', title_mr: 'न्यूरल नेटवर्क्स कसे कार्य करतात?', description: 'From biological neurons to artificial ones — architecture, weights, activations.', type: 'video', order_index: 11, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-1112-12', title: 'Real-Life Applications of Deep Learning', title_hi: 'डीप लर्निंग के वास्तविक अनुप्रयोग', title_mr: 'वास्तविक जीवनातील डीप लर्निंग', description: 'Self-driving cars, medical diagnosis, speech recognition.', type: 'video', order_index: 12, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-1112-13', title: 'Build: Neural Network with TensorFlow & Keras', title_hi: 'TensorFlow और Keras से Neural Network बनाएं', title_mr: 'TensorFlow आणि Keras सह Neural Network', description: 'Build your first neural network using Keras on TensorFlow.', type: 'lab', order_index: 13, duration_min: 30, is_preview: false, content_url: null },
      { id: 'l-1112-14', title: 'Chapter 3 Quiz', title_hi: 'अध्याय ३ प्रश्नोत्तरी', title_mr: 'प्रकरण ३ प्रश्नमंजुषा', description: 'Quiz on deep learning and neural networks.', type: 'quiz', order_index: 14, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-1112-15', title: 'What is Computer Vision?', title_hi: 'कंप्यूटर विज़न क्या है?', title_mr: 'कंप्युटर व्हिजन म्हणजे काय?', description: 'Teaching machines to see — pixels, convolutions, and feature maps.', type: 'video', order_index: 15, duration_min: 20, is_preview: true, content_url: null },
      { id: 'l-1112-16', title: 'How AI Recognizes Images – CNNs', title_hi: 'AI इमेज कैसे पहचानती है – CNN', title_mr: 'AI प्रतिमा कशा ओळखते – CNN', description: 'Convolutional Neural Networks explained with examples.', type: 'video', order_index: 16, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-1112-17', title: 'Face Recognition & AI Cameras', title_hi: 'चेहरा पहचान और AI कैमरे', title_mr: 'चेहरा ओळख आणि AI कॅमेरे', description: 'How AI-powered cameras identify faces and privacy implications.', type: 'video', order_index: 17, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-1112-18', title: 'Build: Plant Disease Detector using Transfer Learning', title_hi: 'पौधा रोग डिटेक्टर बनाएं', title_mr: 'वनस्पती रोग शोधणारे AI तयार करा', description: 'Build an image classifier that detects crop diseases.', type: 'lab', order_index: 18, duration_min: 30, is_preview: false, content_url: null },
      { id: 'l-1112-19', title: 'Chapter 4 Quiz', title_hi: 'अध्याय ४ प्रश्नोत्तरी', title_mr: 'प्रकरण ४ प्रश्नमंजुषा', description: 'Quiz on computer vision.', type: 'quiz', order_index: 19, duration_min: 10, is_preview: false, content_url: null },
      { id: 'l-1112-20', title: 'What is NLP – Natural Language Processing?', title_hi: 'NLP क्या है?', title_mr: 'NLP म्हणजे काय?', description: 'Tokenization, sentiment analysis, chatbots — how AI understands text.', type: 'video', order_index: 20, duration_min: 20, is_preview: true, content_url: null },
      { id: 'l-1112-21', title: 'Final Quiz – NLP & Course Recap', title_hi: 'अंतिम प्रश्नोत्तरी', title_mr: 'अंतिम प्रश्नमंजुषा', description: 'Final assessment: NLP and full course recap.', type: 'quiz', order_index: 21, duration_min: 15, is_preview: false, content_url: null },
    ],
  },

  // ── COURSE 5: Arts Stream ───────────────────────────────────────────────────
  {
    id: 'course-ai-arts',
    slug: 'ai-for-arts-11-12',
    title_en: 'AI for Arts & Humanities – Standard 11 & 12',
    title_mr: 'कला शाखेसाठी AI – इयत्ता ११ वी आणि १२ वी',
    title_hi: 'कला और मानविकी के लिए AI – कक्षा ११ और १२',
    description_en: 'A 3-year AI curriculum for Arts students. Explore AI in visual arts, music, literature, media, and fashion — with Python and real AI tools.',
    description_mr: 'कला विद्यार्थ्यांसाठी ३ वर्षांचा AI अभ्यासक्रम. दृश्यकला, संगीत, साहित्य, मीडिया आणि फॅशनमधील AI.',
    description_hi: 'कला छात्रों के लिए 3-वर्षीय AI पाठ्यक्रम। दृश्य कला, संगीत, साहित्य, मीडिया में AI।',
    category: 'Artificial Intelligence',
    level: 'intermediate',
    duration_hours: 30,
    price: 0,
    target_grade: '11-12',
    stream: 'ARTS',
    playlist_url: 'https://www.youtube.com/playlist?list=REPLACE_PLAYLIST_ARTS',
    tags_json: ['Arts', 'Humanities', 'AI Ethics', 'ML', 'Python', 'Visual Arts', 'Music', 'Literature'],
    thumbnail_url: '/assets/courses/ai-arts.jpg',
    status: 'published',
    lessons: [
      // Year 1
      { id: 'l-arts-01', title: 'Introduction and Definition of AI', title_hi: 'AI का परिचय और परिभाषा', title_mr: 'AI चा परिचय आणि व्याख्या', description: 'What is AI, where did it come from, and why does it matter?', type: 'video', order_index: 1, duration_min: 15, is_preview: true, content_url: null },
      { id: 'l-arts-02', title: 'History and Evolution of AI | AI vs Human Intelligence', title_hi: 'AI का इतिहास | AI बनाम मानव बुद्धि', title_mr: 'AI चा इतिहास | AI विरुद्ध मानवी बुद्धिमत्ता', description: 'From Turing to ChatGPT — AI evolution and comparison with human thought.', type: 'video', order_index: 2, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-03', title: 'AI vs Automation – How It Works', title_hi: 'AI बनाम ऑटोमेशन', title_mr: 'AI vs ऑटोमेशन', description: 'Understand the difference between simple automation and true AI.', type: 'video', order_index: 3, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-arts-04', title: 'Applications of AI in Arts and Humanities', title_hi: 'कला और मानविकी में AI', title_mr: 'कला आणि मानविकीमध्ये AI', description: 'AI in painting, poetry, music composition, and film.', type: 'video', order_index: 4, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-05', title: 'Ethical and Societal Implications of AI', title_hi: 'AI के नैतिक निहितार्थ', title_mr: 'AI चे नैतिक आणि सामाजिक परिणाम', description: 'Jobs, privacy, bias, and the moral responsibilities of AI creators.', type: 'video', order_index: 5, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-arts-06', title: 'Good AI vs Bad AI – Case Studies', title_hi: 'अच्छी AI बनाम बुरी AI', title_mr: 'चांगला AI विरुद्ध वाईट AI', description: 'Case studies of AI used for social good vs harmful applications.', type: 'video', order_index: 6, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-arts-07', title: 'AI Terminology, Project Cycle & Data Types', title_hi: 'AI शब्दावली और प्रोजेक्ट साइकल', title_mr: 'AI परिभाषा, प्रोजेक्ट सायकल', description: 'Key vocabulary and the AI project lifecycle applied to arts problems.', type: 'video', order_index: 7, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-08', title: 'ML Types, Algorithms & Overfitting vs Underfitting', title_hi: 'ML के प्रकार और एल्गोरिदम', title_mr: 'ML चे प्रकार आणि अल्गोरिदम', description: 'Decision trees, clustering, and why balance matters in arts AI.', type: 'video', order_index: 8, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-09', title: 'AI in Visual Arts, Music & Literature', title_hi: 'दृश्य कला, संगीत और साहित्य में AI', title_mr: 'दृश्यकला, संगीत आणि साहित्यात AI', description: 'DALL-E, Midjourney, MuseNet — how AI creates art, music, and writing.', type: 'video', order_index: 9, duration_min: 20, is_preview: true, content_url: null },
      { id: 'l-arts-10', title: 'AI in History, Media, Film & Fashion', title_hi: 'इतिहास, मीडिया, फिल्म और फैशन में AI', title_mr: 'इतिहास, मीडिया, चित्रपट आणि फॅशनमध्ये AI', description: 'Deepfakes, AI-curated museums, AI fashion design.', type: 'video', order_index: 10, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-11', title: 'Year 1 Final Quiz', title_hi: 'वर्ष १ अंतिम प्रश्नोत्तरी', title_mr: 'वर्ष १ अंतिम प्रश्नमंजुषा', description: 'Year 1 assessment.', type: 'quiz', order_index: 11, duration_min: 15, is_preview: false, content_url: null },
      // Year 2
      { id: 'l-arts-12', title: 'AI Tools: Image, Video, Text & Decision (Year 2)', title_hi: 'AI टूल्स: इमेज, वीडियो, टेक्स्ट', title_mr: 'AI साधने: प्रतिमा, व्हिडिओ, मजकूर', description: 'Hands-on with DALL-E, Stable Diffusion, Canva AI, and NLP tools.', type: 'lab', order_index: 12, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-arts-13', title: 'Computational Thinking for Arts', title_hi: 'कला के लिए कम्प्यूटेशनल सोच', title_mr: 'कलासाठी संगणकीय विचार', description: 'Algorithms, conditions, loops, and debugging in a creative context.', type: 'video', order_index: 13, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-14', title: 'Python Basics, Variables & Control Structures', title_hi: 'Python बेसिक्स और वेरिएबल', title_mr: 'Python मूलभूत आणि नियंत्रण संरचना', description: 'Your first Python program — variables, data types, loops, and functions.', type: 'lab', order_index: 14, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-arts-15', title: 'Prompt Engineering for Creative AI', title_hi: 'रचनात्मक AI के लिए प्रॉम्प्ट इंजीनियरिंग', title_mr: 'सर्जनशील AI साठी प्रॉम्प्ट इंजिनीअरिंग', description: 'Write effective AI prompts for art, music, and writing generation.', type: 'lab', order_index: 15, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-arts-16', title: 'Year 2 Quiz', title_hi: 'वर्ष २ प्रश्नोत्तरी', title_mr: 'वर्ष २ प्रश्नमंजुषा', description: 'Year 2 assessment.', type: 'quiz', order_index: 16, duration_min: 12, is_preview: false, content_url: null },
      // Year 3
      { id: 'l-arts-17', title: 'Data Analysis with NumPy, Pandas & Matplotlib', title_hi: 'NumPy, Pandas और Matplotlib से डेटा विश्लेषण', title_mr: 'NumPy, Pandas आणि Matplotlib सह डेटा विश्लेषण', description: 'Analyze datasets and visualize with Matplotlib — arts context.', type: 'lab', order_index: 17, duration_min: 30, is_preview: false, content_url: null },
      { id: 'l-arts-18', title: 'Google Colab, Teachable Machine & Hugging Face', title_hi: 'Google Colab, Teachable Machine और Hugging Face', title_mr: 'Google Colab, Teachable Machine आणि Hugging Face', description: 'Build AI projects using no-code and low-code platforms.', type: 'lab', order_index: 18, duration_min: 40, is_preview: false, content_url: null },
      { id: 'l-arts-19', title: 'Final Capstone: AI Art or Media Tool', title_hi: 'अंतिम प्रोजेक्ट: AI कला टूल', title_mr: 'अंतिम प्रकल्प: AI कला साधन', description: 'Build and present an AI-powered creative tool of your choice.', type: 'lab', order_index: 19, duration_min: 60, is_preview: false, content_url: null },
    ],
  },

  // ── COURSE 6: Commerce Stream ───────────────────────────────────────────────
  {
    id: 'course-ai-commerce',
    slug: 'ai-for-commerce-11-12',
    title_en: 'AI for Commerce – Standard 11 & 12',
    title_mr: 'वाणिज्य शाखेसाठी AI – इयत्ता ११ वी आणि १२ वी',
    title_hi: 'वाणिज्य के लिए AI – कक्षा ११ और १२',
    description_en: 'A 3-year AI curriculum for Commerce students. Learn how AI powers banking, marketing, supply chains, HR, e-commerce, fraud detection, and entrepreneurship.',
    description_mr: 'वाणिज्य विद्यार्थ्यांसाठी ३ वर्षांचा AI अभ्यासक्रम. बँकिंग, मार्केटिंग, फ्रॉड डिटेक्शन आणि उद्योजकतेमध्ये AI.',
    description_hi: 'वाणिज्य छात्रों के लिए 3-वर्षीय AI पाठ्यक्रम। बैंकिंग, मार्केटिंग, धोखाधड़ी पहचान और उद्यमिता में AI।',
    category: 'Artificial Intelligence',
    level: 'intermediate',
    duration_hours: 30,
    price: 0,
    target_grade: '11-12',
    stream: 'COMMERCE',
    playlist_url: 'https://www.youtube.com/playlist?list=REPLACE_PLAYLIST_COMMERCE',
    tags_json: ['Commerce', 'Finance', 'Marketing', 'Fraud Detection', 'E-Commerce', 'Entrepreneurship', 'Python'],
    thumbnail_url: '/assets/courses/ai-commerce.jpg',
    status: 'published',
    lessons: [
      // Year 1
      { id: 'l-com-01', title: 'Introduction, History & Evolution of AI', title_hi: 'AI का परिचय, इतिहास और विकास', title_mr: 'AI चा परिचय, इतिहास आणि उत्क्रांती', description: 'From calculation machines to AI assistants — AI in business.', type: 'video', order_index: 1, duration_min: 15, is_preview: true, content_url: null },
      { id: 'l-com-02', title: 'AI vs Automation in Business', title_hi: 'व्यापार में AI बनाम ऑटोमेशन', title_mr: 'व्यवसायात AI विरुद्ध ऑटोमेशन', description: 'When is it AI and when is it just automation? Business cases.', type: 'video', order_index: 2, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-com-03', title: 'Applications of AI in Commerce', title_hi: 'वाणिज्य में AI के अनुप्रयोग', title_mr: 'वाणिज्यात AI चे अनुप्रयोग', description: 'Chatbots, predictive pricing, smart inventory — AI in commerce.', type: 'video', order_index: 3, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-com-04', title: 'Ethics and Societal Impact of AI in Business', title_hi: 'व्यापार में AI के नैतिक प्रभाव', title_mr: 'व्यवसायातील AI चे नैतिक परिणाम', description: 'Job displacement, data privacy, and algorithmic bias in business.', type: 'video', order_index: 4, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-com-05', title: 'AI in Financial Analytics & Banking', title_hi: 'वित्तीय विश्लेषण और बैंकिंग में AI', title_mr: 'वित्तीय विश्लेषण आणि बँकिंगमध्ये AI', description: 'Credit scoring, loan approvals, and algorithmic trading.', type: 'video', order_index: 5, duration_min: 20, is_preview: true, content_url: null },
      { id: 'l-com-06', title: 'AI in Marketing & Consumer Behaviour', title_hi: 'मार्केटिंग में AI', title_mr: 'मार्केटिंग आणि ग्राहक वर्तनात AI', description: 'Personalization engines, A/B testing, customer segmentation.', type: 'video', order_index: 6, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-com-07', title: 'AI in Supply Chain, HR & E-Commerce', title_hi: 'सप्लाई चेन, HR और ई-कॉमर्स में AI', title_mr: 'पुरवठा साखळी, HR आणि ई-कॉमर्समध्ये AI', description: 'Demand forecasting, resume screening, and product recommendations.', type: 'video', order_index: 7, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-com-08', title: 'AI in Risk Management & Fraud Detection', title_hi: 'जोखिम प्रबंधन और धोखाधड़ी पहचान', title_mr: 'जोखीम व्यवस्थापन आणि फ्रॉड डिटेक्शन', description: 'How AI detects fraud and manages business risk.', type: 'video', order_index: 8, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-com-09', title: 'AI & Entrepreneurship – AI-Powered Startups', title_hi: 'AI और उद्यमिता', title_mr: 'AI आणि उद्योजकता', description: 'How AI enables new businesses and innovations.', type: 'video', order_index: 9, duration_min: 15, is_preview: false, content_url: null },
      { id: 'l-com-10', title: 'Year 1 Final Quiz', title_hi: 'वर्ष १ अंतिम प्रश्नोत्तरी', title_mr: 'वर्ष १ अंतिम प्रश्नमंजुषा', description: 'Year 1 assessment.', type: 'quiz', order_index: 10, duration_min: 15, is_preview: false, content_url: null },
      // Year 2
      { id: 'l-com-11', title: 'AI Tools for Business', title_hi: 'व्यापार के लिए AI टूल्स', title_mr: 'व्यवसायासाठी AI साधने', description: 'Practical AI tools for business analytics and marketing automation.', type: 'lab', order_index: 11, duration_min: 25, is_preview: false, content_url: null },
      { id: 'l-com-12', title: 'Algorithms, Conditions & Business Logic', title_hi: 'एल्गोरिदम, शर्तें और व्यापारिक तर्क', title_mr: 'अल्गोरिदम, अटी आणि व्यवसाय लॉजिक', description: 'Computational thinking applied to business workflows.', type: 'video', order_index: 12, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-com-13', title: 'Python for Commerce: Variables & Control Structures', title_hi: 'वाणिज्य के लिए Python', title_mr: 'वाणिज्यासाठी Python', description: 'Python programming — process sales data, automate reports.', type: 'lab', order_index: 13, duration_min: 30, is_preview: false, content_url: null },
      { id: 'l-com-14', title: 'Prompt Engineering for Business AI', title_hi: 'व्यापार AI के लिए प्रॉम्प्ट इंजीनियरिंग', title_mr: 'व्यवसायासाठी प्रॉम्प्ट इंजिनीअरिंग', description: 'Write effective prompts for ChatGPT, Gemini and business tools.', type: 'lab', order_index: 14, duration_min: 20, is_preview: false, content_url: null },
      { id: 'l-com-15', title: 'Year 2 Quiz', title_hi: 'वर्ष २ प्रश्नोत्तरी', title_mr: 'वर्ष २ प्रश्नमंजुषा', description: 'Year 2 assessment.', type: 'quiz', order_index: 15, duration_min: 12, is_preview: false, content_url: null },
      // Year 3
      { id: 'l-com-16', title: 'Data Analysis with NumPy, Pandas & Matplotlib for Business', title_hi: 'व्यापार डेटा विश्लेषण', title_mr: 'व्यावसायिक डेटा विश्लेषण', description: 'Analyze sales, revenue, and customer data using Python.', type: 'lab', order_index: 16, duration_min: 30, is_preview: false, content_url: null },
      { id: 'l-com-17', title: 'Google Colab, Teachable Machine, Hugging Face & AutoDraw', title_hi: 'AI प्लेटफॉर्म', title_mr: 'AI प्लॅटफॉर्म', description: 'Build AI-powered commerce tools using no-code platforms.', type: 'lab', order_index: 17, duration_min: 40, is_preview: false, content_url: null },
      { id: 'l-com-18', title: 'Final Capstone: AI-Powered Business Solution', title_hi: 'अंतिम प्रोजेक्ट: AI व्यापार समाधान', title_mr: 'अंतिम प्रकल्प: AI व्यवसाय उपाय', description: 'Design and present an AI solution for a real business problem.', type: 'lab', order_index: 18, duration_min: 60, is_preview: false, content_url: null },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding SimuSoft AI courses...\n');

  const tenant = await prisma.tenant.findUnique({ where: { slug: TENANT_SLUG } });
  if (!tenant) {
    throw new Error(`❌ Tenant "${TENANT_SLUG}" not found. Run "node seed.js" first.`);
  }

  let coursesCreated = 0;
  let lessonsCreated = 0;

  for (const course of COURSES) {
    const { lessons, ...courseFields } = course;

    // Upsert course
    const created = await prisma.course.upsert({
      where: { id: courseFields.id },
      update: {
        title_en:       courseFields.title_en,
        title_hi:       courseFields.title_hi,
        title_mr:       courseFields.title_mr,
        description_en: courseFields.description_en,
        description_hi: courseFields.description_hi,
        description_mr: courseFields.description_mr,
        status:         courseFields.status,
        playlist_url:   courseFields.playlist_url,
      },
      create: {
        id:             courseFields.id,
        tenant_id:      tenant.id,
        title_en:       courseFields.title_en,
        title_hi:       courseFields.title_hi,
        title_mr:       courseFields.title_mr,
        description_en: courseFields.description_en,
        description_hi: courseFields.description_hi,
        description_mr: courseFields.description_mr,
        slug:           courseFields.slug,
        category:       courseFields.category,
        level:          courseFields.level,
        duration_hours: courseFields.duration_hours,
        price:          courseFields.price,
        target_grade:   courseFields.target_grade,
        stream:         courseFields.stream,
        playlist_url:   courseFields.playlist_url,
        tags_json:      courseFields.tags_json,
        thumbnail_url:  courseFields.thumbnail_url,
        status:         courseFields.status,
        created_by:     CREATED_BY,
      },
    });

    console.log(`📚 Course: ${created.title_en}`);
    coursesCreated++;

    // Upsert lessons
    for (const lesson of lessons) {
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {
          title:        lesson.title,
          title_hi:     lesson.title_hi,
          title_mr:     lesson.title_mr,
          description:  lesson.description,
          type:         lesson.type,
          order_index:  lesson.order_index,
          duration_min: lesson.duration_min,
          is_preview:   lesson.is_preview,
          content_url:  lesson.content_url,
        },
        create: {
          id:           lesson.id,
          course_id:    created.id,
          title:        lesson.title,
          title_hi:     lesson.title_hi,
          title_mr:     lesson.title_mr,
          description:  lesson.description,
          type:         lesson.type,
          order_index:  lesson.order_index,
          duration_min: lesson.duration_min,
          is_preview:   lesson.is_preview,
          content_url:  lesson.content_url,
        },
      });
      lessonsCreated++;
    }

    console.log(`   ✅ ${lessons.length} lessons created\n`);
  }

  // Enroll demo students in the first 2 AI courses
  const DEMO_STUDENTS = [
    'student-fixed-id-001',
    'student-fixed-id-002',
    'student-fixed-id-003',
  ];
  const ENROLL_COURSES = ['course-ai-std5-6', 'course-ai-std7-8'];

  for (const studentId of DEMO_STUDENTS) {
    for (const courseId of ENROLL_COURSES) {
      const enrollId = `enroll-${studentId}-${courseId}`;
      await prisma.enrollment.upsert({
        where: { id: enrollId },
        update: {},
        create: {
          id:           enrollId,
          user_id:      studentId,
          course_id:    courseId,
          progress_pct: Math.floor(Math.random() * 60),
        },
      });
    }
  }
  console.log('👨‍🎓 Demo students enrolled in AI courses\n');

  console.log('🎉 SimuSoft AI courses seeded successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   Courses created : ${coursesCreated}`);
  console.log(`   Lessons created : ${lessonsCreated}`);
  console.log(`\n📋 Courses:`);
  for (const c of COURSES) {
    console.log(`   • ${c.title_en.padEnd(45)} — ${c.lessons.length} lessons  [${c.stream}]`);
  }
  console.log(`\n⏭  Next: Add YouTube URLs to seed_youtube_patch.js and run it.`);
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
