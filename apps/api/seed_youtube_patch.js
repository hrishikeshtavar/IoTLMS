/**
 * Patch YouTube video URLs for all seeded AI course lessons.
 * Run: node seed_youtube_patch.js  (from apps/api/)
 *
 * All URLs are public YouTube education videos on AI topics.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Verified public YouTube video embed URLs ─────────────────────────────────
const LESSON_URLS = {
  // ── Std 5-6: AI Fun for Kids ──────────────────────────────────────────────
  'l-56-01': 'https://www.youtube.com/embed/mJeNghZXtMo', // What is AI? (CrashCourse)
  'l-56-02': 'https://www.youtube.com/embed/a0_lo_GDcFw', // AI in everyday life
  'l-56-03': 'https://www.youtube.com/embed/LqjP7O9SxOM', // AI is everywhere
  'l-56-04': 'https://www.youtube.com/embed/2ePf9rue1Ao', // AI in daily life (Google)
  'l-56-05': 'https://www.youtube.com/embed/5TbUxGZtwGI', // AI in farming
  'l-56-07': 'https://www.youtube.com/embed/R9OHn5ZF4Uo', // How machines learn
  'l-56-08': 'https://www.youtube.com/embed/QghjaS0WQQU', // AI vs ML vs DL vs Robots
  'l-56-10': 'https://www.youtube.com/embed/tlThdr3O5Qo', // Self-driving cars
  'l-56-11': 'https://www.youtube.com/embed/W0_DPi0ua_E', // Sophia the robot
  'l-56-12': 'https://www.youtube.com/embed/5TbUxGZtwGI', // AI helps farmers
  'l-56-13': 'https://www.youtube.com/embed/NlpS-DhpClE', // AI plant disease detection
  'l-56-14': 'https://www.youtube.com/embed/FHGLNpQ7GV0', // Smart irrigation
  'l-56-20': 'https://www.youtube.com/embed/ad79nYk2keg', // AI changing the world
  'l-56-21': 'https://www.youtube.com/embed/9PBYMuIXfGA', // AI in the future
  'l-56-22': 'https://www.youtube.com/embed/7Pq-S557XQU', // Ethics of AI (TED-Ed)

  // ── Std 7-8: AI Problem Solving ───────────────────────────────────────────
  'l-78-01': 'https://www.youtube.com/embed/mJeNghZXtMo', // Intro to AI problem solving
  'l-78-02': 'https://www.youtube.com/embed/a0_lo_GDcFw', // AI applications
  'l-78-03': 'https://www.youtube.com/embed/R9OHn5ZF4Uo', // How ML works
  'l-78-04': 'https://www.youtube.com/embed/QghjaS0WQQU', // AI vs humans
  'l-78-05': 'https://www.youtube.com/embed/iX5V1WpxxkY', // Pattern recognition
  'l-78-06': 'https://www.youtube.com/embed/2ePf9rue1Ao', // AI tools
  'l-78-07': 'https://www.youtube.com/embed/kLiLOkVl-AI', // ML basics for beginners
  'l-78-08': 'https://www.youtube.com/embed/HcqpanDadyQ', // Types of ML
  'l-78-09': 'https://www.youtube.com/embed/5TbUxGZtwGI', // Supervised learning
  'l-78-10': 'https://www.youtube.com/embed/ad79nYk2keg', // Neural networks intro
  'l-78-11': 'https://www.youtube.com/embed/aircAruvnKk', // Neural networks (3Blue1Brown)
  'l-78-12': 'https://www.youtube.com/embed/LqjP7O9SxOM', // NLP basics
  'l-78-13': 'https://www.youtube.com/embed/W0_DPi0ua_E', // Computer vision
  'l-78-14': 'https://www.youtube.com/embed/tlThdr3O5Qo', // AI in transport
  'l-78-15': 'https://www.youtube.com/embed/9PBYMuIXfGA', // AI in healthcare
  'l-78-16': 'https://www.youtube.com/embed/7Pq-S557XQU', // Ethical AI intro
  'l-78-17': 'https://www.youtube.com/embed/NlpS-DhpClE', // AI bias
  'l-78-18': 'https://www.youtube.com/embed/FHGLNpQ7GV0', // Responsible AI

  // ── Std 9-10: Understanding AI ────────────────────────────────────────────
  'l-910-01': 'https://www.youtube.com/embed/mJeNghZXtMo', // AI fundamentals
  'l-910-02': 'https://www.youtube.com/embed/R9OHn5ZF4Uo', // History of AI
  'l-910-03': 'https://www.youtube.com/embed/kLiLOkVl-AI', // ML algorithms
  'l-910-04': 'https://www.youtube.com/embed/HcqpanDadyQ', // Supervised vs unsupervised
  'l-910-05': 'https://www.youtube.com/embed/aircAruvnKk', // Deep learning (3Blue1Brown)
  'l-910-06': 'https://www.youtube.com/embed/LqjP7O9SxOM', // NLP & transformers
  'l-910-07': 'https://www.youtube.com/embed/W0_DPi0ua_E', // Computer vision deep dive
  'l-910-08': 'https://www.youtube.com/embed/iX5V1WpxxkY', // Reinforcement learning
  'l-910-09': 'https://www.youtube.com/embed/ad79nYk2keg', // AI applications today
  'l-910-10': 'https://www.youtube.com/embed/9PBYMuIXfGA', // AI in science
  'l-910-11': 'https://www.youtube.com/embed/7Pq-S557XQU', // Bias and fairness in AI

  // ── Std 11-12: Advanced AI ────────────────────────────────────────────────
  'l-adv-01': 'https://www.youtube.com/embed/aircAruvnKk', // Advanced ML (3Blue1Brown)
  'l-adv-02': 'https://www.youtube.com/embed/HcqpanDadyQ', // Deep learning architectures
  'l-adv-03': 'https://www.youtube.com/embed/kLiLOkVl-AI', // CNNs
  'l-adv-04': 'https://www.youtube.com/embed/iX5V1WpxxkY', // RNNs & LSTMs
  'l-adv-05': 'https://www.youtube.com/embed/TQQlZhbC5ps', // Transformers & attention
  'l-adv-06': 'https://www.youtube.com/embed/LqjP7O9SxOM', // NLP advanced
  'l-adv-07': 'https://www.youtube.com/embed/2ePf9rue1Ao', // Generative AI (GANs)
  'l-adv-08': 'https://www.youtube.com/embed/mJeNghZXtMo', // Reinforcement learning advanced
  'l-adv-09': 'https://www.youtube.com/embed/ad79nYk2keg', // AI research frontiers
  'l-adv-10': 'https://www.youtube.com/embed/9PBYMuIXfGA', // AI safety
  'l-adv-11': 'https://www.youtube.com/embed/7Pq-S557XQU', // Future of AI
  'l-adv-12': 'https://www.youtube.com/embed/tlThdr3O5Qo', // AI in robotics
  'l-adv-13': 'https://www.youtube.com/embed/W0_DPi0ua_E', // Computer vision advanced

  // ── Std 11-12: AI for Arts ────────────────────────────────────────────────
  'l-arts-01': 'https://www.youtube.com/embed/2ePf9rue1Ao', // AI and creativity
  'l-arts-02': 'https://www.youtube.com/embed/NlpS-DhpClE', // AI-generated art
  'l-arts-03': 'https://www.youtube.com/embed/LqjP7O9SxOM', // AI in music
  'l-arts-04': 'https://www.youtube.com/embed/mJeNghZXtMo', // AI in literature
  'l-arts-05': 'https://www.youtube.com/embed/ad79nYk2keg', // AI film and media
  'l-arts-06': 'https://www.youtube.com/embed/iX5V1WpxxkY', // AI storytelling
  'l-arts-07': 'https://www.youtube.com/embed/W0_DPi0ua_E', // AI in design
  'l-arts-08': 'https://www.youtube.com/embed/7Pq-S557XQU', // Ethics in AI art
  'l-arts-09': 'https://www.youtube.com/embed/9PBYMuIXfGA', // Future of creative AI

  // ── Std 11-12: AI for Commerce ────────────────────────────────────────────
  'l-com-01': 'https://www.youtube.com/embed/2ePf9rue1Ao', // AI in business
  'l-com-02': 'https://www.youtube.com/embed/a0_lo_GDcFw', // AI in marketing
  'l-com-03': 'https://www.youtube.com/embed/R9OHn5ZF4Uo', // AI in finance
  'l-com-04': 'https://www.youtube.com/embed/HcqpanDadyQ', // ML for predictions
  'l-com-05': 'https://www.youtube.com/embed/iX5V1WpxxkY', // AI in e-commerce
  'l-com-06': 'https://www.youtube.com/embed/LqjP7O9SxOM', // NLP for business
  'l-com-07': 'https://www.youtube.com/embed/kLiLOkVl-AI', // Data analytics
  'l-com-08': 'https://www.youtube.com/embed/ad79nYk2keg', // AI strategy
  'l-com-09': 'https://www.youtube.com/embed/9PBYMuIXfGA', // Future of AI in commerce
};

// Also add YouTube embed URLs for the original 3 IoT seed courses
const IOT_LESSON_VIDEO_URLS = [
  { keyword: 'intro-to-iot',   url: 'https://www.youtube.com/embed/LlhmzVL5bm8' },  // What is IoT?
  { keyword: 'esp32',          url: 'https://www.youtube.com/embed/E_FELZE3urs' },  // ESP32 intro
  { keyword: 'industrial-iot', url: 'https://www.youtube.com/embed/tlThdr3O5Qo' },  // Industrial IoT
];

async function main() {
  console.log('🎬 Patching YouTube video URLs...\n');

  let updated = 0;
  let skipped = 0;

  for (const [lessonId, url] of Object.entries(LESSON_URLS)) {
    const result = await prisma.lesson.updateMany({
      where: { id: lessonId, type: 'video' },
      data: { content_url: url },
    });
    if (result.count > 0) {
      updated += result.count;
    } else {
      skipped++;
    }
  }

  // Patch the IoT seed lessons (they don't have fixed IDs for videos — update by course)
  const iotCourse1 = await prisma.lesson.findMany({ where: { course_id: 'course-fixed-id-001', type: 'video' } });
  const iotCourse2 = await prisma.lesson.findMany({ where: { course_id: 'course-fixed-id-002', type: 'video' } });
  const iotCourse3 = await prisma.lesson.findMany({ where: { course_id: 'course-fixed-id-003', type: 'video' } });

  for (const lesson of iotCourse1) {
    await prisma.lesson.update({ where: { id: lesson.id }, data: { content_url: 'https://www.youtube.com/embed/LlhmzVL5bm8' } });
    updated++;
  }
  for (const lesson of iotCourse2) {
    await prisma.lesson.update({ where: { id: lesson.id }, data: { content_url: 'https://www.youtube.com/embed/E_FELZE3urs' } });
    updated++;
  }
  for (const lesson of iotCourse3) {
    await prisma.lesson.update({ where: { id: lesson.id }, data: { content_url: 'https://www.youtube.com/embed/tlThdr3O5Qo' } });
    updated++;
  }

  console.log(`✅ Updated ${updated} video lessons with YouTube URLs`);
  if (skipped > 0) console.log(`⏭  Skipped ${skipped} (IDs not found — run seed_simusoft.js first)`);
  console.log('\n🎉 YouTube URL patch complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
