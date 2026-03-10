/**
 * IoTLearn — Demo Seed
 * Creates 3 schools, 35+ students, 6 courses, realistic activities,
 * payments, badges and certificates for a convincing demo.
 *
 * Run from apps/api:
 *   node seed_demo.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = new PrismaClient();

// ─── helpers ────────────────────────────────────────────────────────────────

function uid(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString('hex')}`;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

// ─── data ────────────────────────────────────────────────────────────────────

const SCHOOLS = [
  {
    id: 'tenant-greenfield-001',
    slug: 'greenfield',
    name: 'Greenfield IoT Academy',
    plan_id: 'pro',
    colors: { primary: '#FF6B35', secondary: '#1A73E8', accent: '#00C896' },
    adminEmail: 'admin@greenfield.edu',
    adminName: 'Priya Sharma',
  },
  {
    id: 'tenant-delhi-002',
    slug: 'delhismart',
    name: 'Delhi Smart School',
    plan_id: 'starter',
    colors: { primary: '#1A73E8', secondary: '#A855F7', accent: '#FFD93D' },
    adminEmail: 'admin@delhismart.edu',
    adminName: 'Rajan Gupta',
  },
  {
    id: 'tenant-mumbai-003',
    slug: 'mumbaitech',
    name: 'Mumbai Tech Institute',
    plan_id: 'starter',
    colors: { primary: '#A855F7', secondary: '#FF6B35', accent: '#00C896' },
    adminEmail: 'admin@mumbaitech.edu',
    adminName: 'Meera Joshi',
  },
];

const COURSES = [
  {
    id: 'course-intro-iot-001',
    tenant_id: 'tenant-greenfield-001',
    title_en: 'Introduction to IoT',
    title_hi: 'IoT का परिचय',
    title_mr: 'IoT ची ओळख',
    slug: 'intro-iot',
    category: 'IoT',
    status: 'published',
  },
  {
    id: 'course-arduino-002',
    tenant_id: 'tenant-greenfield-001',
    title_en: 'Arduino Programming',
    title_hi: 'Arduino प्रोग्रामिंग',
    title_mr: 'Arduino प्रोग्रामिंग',
    slug: 'arduino-programming',
    category: 'Arduino',
    status: 'published',
  },
  {
    id: 'course-esp32-003',
    tenant_id: 'tenant-greenfield-001',
    title_en: 'ESP32 & WiFi IoT',
    title_hi: 'ESP32 और WiFi IoT',
    title_mr: 'ESP32 आणि WiFi IoT',
    slug: 'esp32-wifi-iot',
    category: 'ESP32',
    status: 'published',
  },
  {
    id: 'course-raspi-004',
    tenant_id: 'tenant-delhi-002',
    title_en: 'Raspberry Pi Projects',
    title_hi: 'Raspberry Pi प्रोजेक्ट्स',
    title_mr: 'Raspberry Pi प्रकल्प',
    slug: 'raspberry-pi-projects',
    category: 'Raspberry Pi',
    status: 'published',
  },
  {
    id: 'course-sensors-005',
    tenant_id: 'tenant-delhi-002',
    title_en: 'Sensors & Actuators',
    title_hi: 'सेंसर और एक्चुएटर',
    title_mr: 'सेन्सर्स आणि अॅक्च्युएटर्स',
    slug: 'sensors-actuators',
    category: 'IoT',
    status: 'published',
  },
  {
    id: 'course-riscv-006',
    tenant_id: 'tenant-mumbai-003',
    title_en: 'RISC-V Architecture',
    title_hi: 'RISC-V आर्किटेक्चर',
    title_mr: 'RISC-V आर्किटेक्चर',
    slug: 'riscv-architecture',
    category: 'RISC-V',
    status: 'published',
  },
];

const LESSONS = [
  // Course 1 – Intro to IoT
  { id: 'lesson-001', course_id: 'course-intro-iot-001', title: 'What is IoT?', type: 'text', order_index: 1 },
  { id: 'lesson-002', course_id: 'course-intro-iot-001', title: 'Sensors & Actuators', type: 'text', order_index: 2 },
  { id: 'lesson-003', course_id: 'course-intro-iot-001', title: 'Connectivity Protocols', type: 'text', order_index: 3 },
  { id: 'lesson-004', course_id: 'course-intro-iot-001', title: 'Cloud Platforms', type: 'text', order_index: 4 },
  { id: 'lesson-005', course_id: 'course-intro-iot-001', title: 'IoT Quiz 1', type: 'quiz', order_index: 5 },
  { id: 'lesson-006', course_id: 'course-intro-iot-001', title: 'IoT Blink Lab', type: 'lab', order_index: 6 },

  // Course 2 – Arduino
  { id: 'lesson-011', course_id: 'course-arduino-002', title: 'Arduino IDE Setup', type: 'video', order_index: 1 },
  { id: 'lesson-012', course_id: 'course-arduino-002', title: 'Digital I/O', type: 'text', order_index: 2 },
  { id: 'lesson-013', course_id: 'course-arduino-002', title: 'Analog & PWM', type: 'text', order_index: 3 },
  { id: 'lesson-014', course_id: 'course-arduino-002', title: 'Blink & Fade Lab', type: 'lab', order_index: 4 },
  { id: 'lesson-015', course_id: 'course-arduino-002', title: 'Serial Communication', type: 'text', order_index: 5 },
  { id: 'lesson-016', course_id: 'course-arduino-002', title: 'Arduino Quiz', type: 'quiz', order_index: 6 },

  // Course 3 – ESP32
  { id: 'lesson-021', course_id: 'course-esp32-003', title: 'ESP32 vs Arduino', type: 'text', order_index: 1 },
  { id: 'lesson-022', course_id: 'course-esp32-003', title: 'WiFi Connection', type: 'text', order_index: 2 },
  { id: 'lesson-023', course_id: 'course-esp32-003', title: 'MQTT Basics', type: 'text', order_index: 3 },
  { id: 'lesson-024', course_id: 'course-esp32-003', title: 'Sending Sensor Data', type: 'lab', order_index: 4 },
  { id: 'lesson-025', course_id: 'course-esp32-003', title: 'ESP32 Quiz', type: 'quiz', order_index: 5 },

  // Course 4 – Raspberry Pi
  { id: 'lesson-031', course_id: 'course-raspi-004', title: 'Setting up Raspberry Pi', type: 'video', order_index: 1 },
  { id: 'lesson-032', course_id: 'course-raspi-004', title: 'GPIO Programming in Python', type: 'text', order_index: 2 },
  { id: 'lesson-033', course_id: 'course-raspi-004', title: 'Camera Module Lab', type: 'lab', order_index: 3 },
  { id: 'lesson-034', course_id: 'course-raspi-004', title: 'Pi Quiz', type: 'quiz', order_index: 4 },

  // Course 5 – Sensors
  { id: 'lesson-041', course_id: 'course-sensors-005', title: 'DHT11 Temperature Sensor', type: 'text', order_index: 1 },
  { id: 'lesson-042', course_id: 'course-sensors-005', title: 'Ultrasonic Distance Sensor', type: 'text', order_index: 2 },
  { id: 'lesson-043', course_id: 'course-sensors-005', title: 'Sensor Lab: Multi-sensor', type: 'lab', order_index: 3 },
  { id: 'lesson-044', course_id: 'course-sensors-005', title: 'Sensors Quiz', type: 'quiz', order_index: 4 },

  // Course 6 – RISC-V
  { id: 'lesson-051', course_id: 'course-riscv-006', title: 'ISA Architecture', type: 'text', order_index: 1 },
  { id: 'lesson-052', course_id: 'course-riscv-006', title: 'RISC-V Registers', type: 'text', order_index: 2 },
  { id: 'lesson-053', course_id: 'course-riscv-006', title: 'Assembly Basics', type: 'text', order_index: 3 },
  { id: 'lesson-054', course_id: 'course-riscv-006', title: 'RISC-V Quiz', type: 'quiz', order_index: 4 },
];

const LESSON_CONTENTS = [
  {
    lesson_id: 'lesson-001',
    locale: 'en',
    content_json: {
      type: 'doc',
      content: [
        { type: 'heading', content: [{ type: 'text', text: 'What is IoT?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'The Internet of Things (IoT) refers to the network of physical devices embedded with sensors, software, and connectivity that enables them to collect and exchange data.' }] },
        { type: 'heading', content: [{ type: 'text', text: 'Key Components' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Sensors – Collect data from the environment (temperature, humidity, motion)' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Connectivity – Wi-Fi, Bluetooth, Zigbee, LoRa' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Processing – Microcontrollers and edge computing' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cloud – Store, analyze, and visualize data' }] }] },
        ]},
        { type: 'heading', content: [{ type: 'text', text: 'Real World Examples' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Smart thermostats like Nest, fitness trackers, connected cars, and industrial sensors are all IoT devices. By 2030, over 25 billion IoT devices are expected to be connected worldwide.' }] },
        { type: 'codeBlock', content: [{ type: 'text', text: '// Simple IoT concept in pseudocode\nread sensor_value from DHT11;\nif (sensor_value.temp > 30) {\n  send_alert("Too hot!");\n  turn_on(fan);\n}' }] },
      ],
    },
    status: 'published',
  },
  {
    lesson_id: 'lesson-002',
    locale: 'en',
    content_json: {
      type: 'doc',
      content: [
        { type: 'heading', content: [{ type: 'text', text: 'Sensors & Actuators' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Sensors are the eyes and ears of an IoT system. Actuators are its hands — they take physical actions based on processed data.' }] },
        { type: 'heading', content: [{ type: 'text', text: 'Common Sensors' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'DHT11/DHT22 – Temperature and humidity' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'HC-SR04 – Ultrasonic distance' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'PIR – Motion detection' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'MQ-2 – Gas and smoke detection' }] }] },
        ]},
        { type: 'codeBlock', content: [{ type: 'text', text: '#include <DHT.h>\n#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin();\n}\n\nvoid loop() {\n  float temp = dht.readTemperature();\n  float hum  = dht.readHumidity();\n  Serial.print("Temp: "); Serial.print(temp);\n  Serial.print(" °C  Humidity: "); Serial.println(hum);\n  delay(2000);\n}' }] },
      ],
    },
    status: 'published',
  },
  {
    lesson_id: 'lesson-003',
    locale: 'en',
    content_json: {
      type: 'doc',
      content: [
        { type: 'heading', content: [{ type: 'text', text: 'Connectivity Protocols' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Choosing the right communication protocol is critical in IoT design. Each protocol has different trade-offs in range, power consumption, and bandwidth.' }] },
        { type: 'heading', content: [{ type: 'text', text: 'Short Range Protocols' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Wi-Fi – High bandwidth, high power. Best for home IoT.' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bluetooth LE – Low power, short range. Best for wearables.' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Zigbee – Mesh network, low power. Best for smart home sensors.' }] }] },
        ]},
        { type: 'heading', content: [{ type: 'text', text: 'Long Range Protocols' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'LoRaWAN – Kilometers of range, very low power. Perfect for agriculture.' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'NB-IoT – Uses cellular networks. Best for smart meters.' }] }] },
        ]},
        { type: 'heading', content: [{ type: 'text', text: 'Messaging Protocols' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'MQTT – Lightweight publish/subscribe. Most popular for IoT.' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'HTTP/REST – Standard web protocol, higher overhead.' }] }] },
        ]},
      ],
    },
    status: 'published',
  },
  {
    lesson_id: 'lesson-012',
    locale: 'en',
    content_json: {
      type: 'doc',
      content: [
        { type: 'heading', content: [{ type: 'text', text: 'Digital I/O with Arduino' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Arduino has both digital and analog pins. Digital pins can be INPUT or OUTPUT, reading or writing HIGH (5V) or LOW (0V).' }] },
        { type: 'codeBlock', content: [{ type: 'text', text: 'void setup() {\n  pinMode(13, OUTPUT); // LED\n  pinMode(2, INPUT);   // Button\n}\n\nvoid loop() {\n  int buttonState = digitalRead(2);\n  if (buttonState == HIGH) {\n    digitalWrite(13, HIGH); // LED ON\n  } else {\n    digitalWrite(13, LOW);  // LED OFF\n  }\n}' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'The `pinMode` function configures pins as INPUT or OUTPUT. `digitalRead` returns HIGH or LOW. `digitalWrite` sets a pin to HIGH or LOW.' }] },
      ],
    },
    status: 'published',
  },
  {
    lesson_id: 'lesson-021',
    locale: 'en',
    content_json: {
      type: 'doc',
      content: [
        { type: 'heading', content: [{ type: 'text', text: 'ESP32 vs Arduino' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'The ESP32 is a powerful microcontroller that adds WiFi and Bluetooth built-in, making it the go-to choice for IoT projects.' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Dual-core 240 MHz Xtensa LX6 processor (vs Arduino Uno\'s 16 MHz)' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '520 KB SRAM, 4 MB Flash' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Built-in WiFi 802.11 b/g/n and Bluetooth 4.2' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '36 GPIO pins with ADC, DAC, I2C, SPI, UART' }] }] },
        ]},
        { type: 'codeBlock', content: [{ type: 'text', text: '#include <WiFi.h>\n\nconst char* ssid = "YourSSID";\nconst char* password = "YourPassword";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(".");\n  }\n  Serial.println("\\nConnected! IP: " + WiFi.localIP().toString());\n}' }] },
      ],
    },
    status: 'published',
  },
];

const STUDENT_NAMES = [
  // Greenfield students
  ['Arjun Patil',    'arjun@greenfield.edu',   'tenant-greenfield-001'],
  ['Sneha Desai',    'sneha@greenfield.edu',    'tenant-greenfield-001'],
  ['Rahul Nair',     'rahul@greenfield.edu',    'tenant-greenfield-001'],
  ['Ananya Rao',     'ananya@greenfield.edu',   'tenant-greenfield-001'],
  ['Vikram Mehta',   'vikram@greenfield.edu',   'tenant-greenfield-001'],
  ['Pooja Iyer',     'pooja@greenfield.edu',    'tenant-greenfield-001'],
  ['Karan Singh',    'karan@greenfield.edu',    'tenant-greenfield-001'],
  ['Divya Kumar',    'divya@greenfield.edu',    'tenant-greenfield-001'],
  ['Suresh Pillai',  'suresh@greenfield.edu',   'tenant-greenfield-001'],
  ['Neha Verma',     'neha@greenfield.edu',     'tenant-greenfield-001'],
  ['Rohit Sharma',   'rohit@greenfield.edu',    'tenant-greenfield-001'],
  ['Priya Patel',    'priya2@greenfield.edu',   'tenant-greenfield-001'],
  // Delhi Smart School students
  ['Aditya Bose',    'aditya@delhismart.edu',   'tenant-delhi-002'],
  ['Kavya Reddy',    'kavya@delhismart.edu',    'tenant-delhi-002'],
  ['Nikhil Jain',    'nikhil@delhismart.edu',   'tenant-delhi-002'],
  ['Simran Kaur',    'simran@delhismart.edu',   'tenant-delhi-002'],
  ['Manish Tiwari',  'manish@delhismart.edu',   'tenant-delhi-002'],
  ['Riya Ghosh',     'riya@delhismart.edu',     'tenant-delhi-002'],
  ['Aryan Malhotra', 'aryan@delhismart.edu',    'tenant-delhi-002'],
  ['Tanvi Mishra',   'tanvi@delhismart.edu',    'tenant-delhi-002'],
  ['Harsh Agarwal',  'harsh@delhismart.edu',    'tenant-delhi-002'],
  ['Ishika Saxena',  'ishika@delhismart.edu',   'tenant-delhi-002'],
  // Mumbai Tech Institute students
  ['Vivek Kulkarni', 'vivek@mumbaitech.edu',    'tenant-mumbai-003'],
  ['Anjali Naik',    'anjali@mumbaitech.edu',   'tenant-mumbai-003'],
  ['Pratik Wagh',    'pratik@mumbaitech.edu',   'tenant-mumbai-003'],
  ['Sakshi More',    'sakshi@mumbaitech.edu',   'tenant-mumbai-003'],
  ['Tejas Shinde',   'tejas@mumbaitech.edu',    'tenant-mumbai-003'],
  ['Gauri Bhosale',  'gauri@mumbaitech.edu',    'tenant-mumbai-003'],
  ['Akash Pawar',    'akash@mumbaitech.edu',    'tenant-mumbai-003'],
  ['Rutuja Jadhav',  'rutuja@mumbaitech.edu',   'tenant-mumbai-003'],
  ['Saurabh Salve',  'saurabh@mumbaitech.edu',  'tenant-mumbai-003'],
  ['Snehal Deshpande','snehal@mumbaitech.edu',  'tenant-mumbai-003'],
];

const BADGE_DEFS = [
  { code: 'first_lesson',  name_en: 'First Step',    icon_emoji: '🎯', threshold_type: 'lessons', threshold_value: 1 },
  { code: 'five_lessons',  name_en: 'On Fire',       icon_emoji: '🔥', threshold_type: 'lessons', threshold_value: 5 },
  { code: 'ten_lessons',   name_en: 'Dedicated',     icon_emoji: '💪', threshold_type: 'lessons', threshold_value: 10 },
  { code: 'first_quiz',    name_en: 'Quiz Master',   icon_emoji: '🧠', threshold_type: 'quizzes', threshold_value: 1 },
  { code: 'first_lab',     name_en: 'Lab Rat',       icon_emoji: '🔬', threshold_type: 'labs',    threshold_value: 1 },
  { code: 'first_cert',    name_en: 'Certified',     icon_emoji: '🏆', threshold_type: 'certs',   threshold_value: 1 },
  { code: 'three_courses', name_en: 'Bookworm',      icon_emoji: '📚', threshold_type: 'courses', threshold_value: 3 },
  { code: 'week_streak',   name_en: '7-Day Streak',  icon_emoji: '🗓️',  threshold_type: 'streak',  threshold_value: 7 },
];

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 IoTLearn Demo Seed starting...\n');

  // ── Badges (global, no tenant) ────────────────────────────────────────────
  console.log('Creating badges...');
  const badges = {};
  for (const b of BADGE_DEFS) {
    const badge = await prisma.badge.upsert({
      where: { code: b.code },
      update: {},
      create: b,
    });
    badges[b.code] = badge.id;
  }
  console.log(`  ✓ ${BADGE_DEFS.length} badges`);

  // ── Super admin (cross-tenant) ────────────────────────────────────────────
  const superHash = await bcrypt.hash('Super@1234', 12);
  await prisma.user.upsert({
    where: { id: 'super-admin-fixed-id-001' },
    update: {},
    create: {
      id: 'super-admin-fixed-id-001',
      tenant_id: 'tenant-greenfield-001',
      name: 'Super Admin',
      email: 'super@iotlearn.in',
      role: 'super_admin',
      password_hash: superHash,
      email_verified: true,
    },
  }).catch(() => {}); // may fail if tenant not created yet — re-run after tenants

  // ── Tenants + admins + brandkits ──────────────────────────────────────────
  console.log('Creating schools...');
  const adminHash = await bcrypt.hash('Admin@1234', 12);
  for (const school of SCHOOLS) {
    const tenant = await prisma.tenant.upsert({
      where: { id: school.id },
      update: {},
      create: {
        id: school.id,
        slug: school.slug,
        name: school.name,
        plan_id: school.plan_id,
        is_active: true,
      },
    });

    await prisma.brandKit.upsert({
      where: { tenant_id: school.id },
      update: {},
      create: {
        tenant_id: school.id,
        colors_json: school.colors,
        fonts_json: { heading: 'Baloo 2', body: 'Inter' },
      },
    });

    await prisma.user.upsert({
      where: { id: `admin-${school.id}` },
      update: {},
      create: {
        id: `admin-${school.id}`,
        tenant_id: school.id,
        name: school.adminName,
        email: school.adminEmail,
        role: 'admin',
        password_hash: adminHash,
        email_verified: true,
      },
    });
    console.log(`  ✓ ${school.name}`);
  }

  // Fix super admin tenant (now tenant exists)
  await prisma.user.upsert({
    where: { id: 'super-admin-fixed-id-001' },
    update: {},
    create: {
      id: 'super-admin-fixed-id-001',
      tenant_id: 'tenant-greenfield-001',
      name: 'Super Admin',
      email: 'super@iotlearn.in',
      role: 'super_admin',
      password_hash: superHash,
      email_verified: true,
    },
  });

  // ── Courses ───────────────────────────────────────────────────────────────
  console.log('Creating courses...');
  for (const c of COURSES) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }
  console.log(`  ✓ ${COURSES.length} courses`);

  // ── Lessons ───────────────────────────────────────────────────────────────
  console.log('Creating lessons...');
  for (const l of LESSONS) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: l,
    });
  }
  console.log(`  ✓ ${LESSONS.length} lessons`);

  // ── Lesson content ────────────────────────────────────────────────────────
  console.log('Creating lesson content...');
  for (const lc of LESSON_CONTENTS) {
    await prisma.lessonContent.upsert({
      where: { lesson_id_locale: { lesson_id: lc.lesson_id, locale: lc.locale } },
      update: {},
      create: lc,
    });
  }
  console.log(`  ✓ ${LESSON_CONTENTS.length} lesson content blocks`);

  // ── Assessments + Questions ───────────────────────────────────────────────
  console.log('Creating assessments...');
  const quizLessons = LESSONS.filter(l => l.type === 'quiz');
  for (const l of quizLessons) {
    const asmtId = `asmt-${l.id}`;
    await prisma.assessment.upsert({
      where: { id: asmtId },
      update: {},
      create: { id: asmtId, lesson_id: l.id, type: 'quiz', max_score: 30, pass_score: 20 },
    });
    const qs = [
      {
        id: `q1-${l.id}`, assessment_id: asmtId, type: 'mcq',
        question_text: 'What does IoT stand for?',
        options_json: [
          { value: 'A', label: 'Internet of Things' },
          { value: 'B', label: 'Internet of Technology' },
          { value: 'C', label: 'Integrated Operations Technology' },
          { value: 'D', label: 'Interface of Tools' },
        ],
        correct_answer: 'A', points: 10,
      },
      {
        id: `q2-${l.id}`, assessment_id: asmtId, type: 'mcq',
        question_text: 'Which protocol is most popular for IoT messaging?',
        options_json: [
          { value: 'A', label: 'HTTP' },
          { value: 'B', label: 'MQTT' },
          { value: 'C', label: 'FTP' },
          { value: 'D', label: 'SMTP' },
        ],
        correct_answer: 'B', points: 10,
      },
      {
        id: `q3-${l.id}`, assessment_id: asmtId, type: 'mcq',
        question_text: 'Which sensor measures temperature and humidity?',
        options_json: [
          { value: 'A', label: 'PIR' },
          { value: 'B', label: 'HC-SR04' },
          { value: 'C', label: 'DHT11' },
          { value: 'D', label: 'MQ-2' },
        ],
        correct_answer: 'C', points: 10,
      },
    ];
    for (const q of qs) {
      await prisma.question.upsert({ where: { id: q.id }, update: {}, create: q });
    }
  }
  console.log(`  ✓ ${quizLessons.length} assessments with questions`);

  // ── Students ──────────────────────────────────────────────────────────────
  console.log('Creating students...');
  const studentHash = await bcrypt.hash('Student@1234', 12);
  const studentIds = [];
  for (let i = 0; i < STUDENT_NAMES.length; i++) {
    const [name, email, tenantId] = STUDENT_NAMES[i];
    const id = `student-${String(i + 1).padStart(3, '0')}`;
    studentIds.push({ id, name, tenantId });
    await prisma.user.upsert({
      where: { id },
      update: {},
      create: {
        id,
        tenant_id: tenantId,
        name,
        email,
        role: 'student',
        password_hash: studentHash,
        email_verified: true,
        language_pref: tenantId === 'tenant-delhi-002' ? 'hi' : 'en',
      },
    });
  }
  console.log(`  ✓ ${studentIds.length} students`);

  // ── Enrollments, Progress, Activities, Submissions, Certs ────────────────
  console.log('Creating enrollments & activity...');
  const coursesByTenant = {
    'tenant-greenfield-001': ['course-intro-iot-001', 'course-arduino-002', 'course-esp32-003'],
    'tenant-delhi-002':      ['course-raspi-004', 'course-sensors-005'],
    'tenant-mumbai-003':     ['course-riscv-006'],
  };

  let enrollCount = 0;
  let actCount = 0;
  let subCount = 0;
  let certCount = 0;

  for (let si = 0; si < studentIds.length; si++) {
    const { id: userId, tenantId } = studentIds[si];
    const rng = seededRandom(si * 9999 + 1);
    const availableCourses = coursesByTenant[tenantId] || [];

    // Enroll in 1-3 courses
    const numCourses = Math.floor(rng() * Math.min(3, availableCourses.length)) + 1;
    const enrolled = availableCourses.slice(0, numCourses);

    for (const courseId of enrolled) {
      const progressPct = si < 5 ? 100 : si < 15 ? Math.floor(rng() * 60 + 30) : Math.floor(rng() * 40 + 5);
      const completedAt = progressPct === 100 ? daysAgo(Math.floor(rng() * 10 + 1)) : null;

      const enrollId = `enroll-${userId}-${courseId}`;
      await prisma.enrollment.upsert({
        where: { id: enrollId },
        update: {},
        create: {
          id: enrollId,
          user_id: userId,
          course_id: courseId,
          progress_pct: progressPct,
          enrolled_at: daysAgo(Math.floor(rng() * 25 + 5)),
          completed_at: completedAt,
        },
      });
      enrollCount++;

      // Create activity records (past 10 days for streaks)
      const numActiveDays = completedAt ? 10 : Math.floor(rng() * 7 + 1);
      const courseLessons = LESSONS.filter(l => l.course_id === courseId);
      for (let d = 0; d < numActiveDays; d++) {
        const actDate = daysAgo(d);
        await prisma.userActivity.create({
          data: {
            user_id: userId,
            tenant_id: tenantId,
            activity_type: 'lesson_complete',
            entity_id: courseLessons[d % courseLessons.length]?.id,
            created_at: actDate,
          },
        });
        actCount++;
      }

      // Quiz submission (for enrolled students who are past 40%)
      if (progressPct > 40) {
        const asmtId = `asmt-lesson-${courseId === 'course-intro-iot-001' ? '005' : courseId === 'course-arduino-002' ? '016' : courseId === 'course-esp32-003' ? '025' : courseId === 'course-raspi-004' ? '034' : courseId === 'course-sensors-005' ? '044' : '054'}`;
        const passed = rng() > 0.25;
        const score = passed ? Math.floor(rng() * 10 + 20) : Math.floor(rng() * 15 + 5);
        try {
          await prisma.submission.create({
            data: {
              user_id: userId,
              assessment_id: asmtId,
              answers_json: { A: 'A', B: 'B', C: 'C' },
              score,
              passed,
              graded_at: daysAgo(Math.floor(rng() * 5)),
            },
          });
          subCount++;
        } catch {}
      }

      // Certificate (completed)
      if (completedAt && progressPct === 100) {
        const certCode = `IOTL-${courseId.slice(7, 13).toUpperCase()}-${userId.slice(8, 12).toUpperCase()}`;
        try {
          await prisma.certificate.upsert({
            where: { user_id_course_id: { user_id: userId, course_id: courseId } },
            update: {},
            create: {
              user_id: userId,
              course_id: courseId,
              tenant_id: tenantId,
              cert_code: certCode,
              score_pct: Math.floor(rng() * 20 + 80),
              issued_at: completedAt,
            },
          });
          certCount++;

          // Badge: first_cert
          await prisma.userBadge.upsert({
            where: { user_id_badge_id: { user_id: userId, badge_id: badges['first_cert'] } },
            update: {},
            create: { user_id: userId, badge_id: badges['first_cert'] },
          }).catch(() => {});
        } catch {}
      }

      // Badges for lesson activity
      await prisma.userBadge.upsert({
        where: { user_id_badge_id: { user_id: userId, badge_id: badges['first_lesson'] } },
        update: {},
        create: { user_id: userId, badge_id: badges['first_lesson'] },
      }).catch(() => {});

      if (progressPct > 50) {
        await prisma.userBadge.upsert({
          where: { user_id_badge_id: { user_id: userId, badge_id: badges['five_lessons'] } },
          update: {},
          create: { user_id: userId, badge_id: badges['five_lessons'] },
        }).catch(() => {});
        await prisma.userBadge.upsert({
          where: { user_id_badge_id: { user_id: userId, badge_id: badges['first_lab'] } },
          update: {},
          create: { user_id: userId, badge_id: badges['first_lab'] },
        }).catch(() => {});
      }
      if (progressPct > 40) {
        await prisma.userBadge.upsert({
          where: { user_id_badge_id: { user_id: userId, badge_id: badges['first_quiz'] } },
          update: {},
          create: { user_id: userId, badge_id: badges['first_quiz'] },
        }).catch(() => {});
      }
    }

    if (enrolled.length >= 3) {
      await prisma.userBadge.upsert({
        where: { user_id_badge_id: { user_id: userId, badge_id: badges['three_courses'] } },
        update: {},
        create: { user_id: userId, badge_id: badges['three_courses'] },
      }).catch(() => {});
    }

    if (si < 8) {
      await prisma.userBadge.upsert({
        where: { user_id_badge_id: { user_id: userId, badge_id: badges['week_streak'] } },
        update: {},
        create: { user_id: userId, badge_id: badges['week_streak'] },
      }).catch(() => {});
      await prisma.userBadge.upsert({
        where: { user_id_badge_id: { user_id: userId, badge_id: badges['ten_lessons'] } },
        update: {},
        create: { user_id: userId, badge_id: badges['ten_lessons'] },
      }).catch(() => {});
    }
  }
  console.log(`  ✓ ${enrollCount} enrollments`);
  console.log(`  ✓ ${actCount} activity records`);
  console.log(`  ✓ ${subCount} quiz submissions`);
  console.log(`  ✓ ${certCount} certificates`);

  // ── Payments ──────────────────────────────────────────────────────────────
  console.log('Creating payments...');
  const PAYMENT_STUDENTS = [
    'Arjun Patil', 'Sneha Desai', 'Rahul Nair', 'Ananya Rao', 'Vikram Mehta',
    'Pooja Iyer', 'Karan Singh', 'Divya Kumar', 'Suresh Pillai', 'Neha Verma',
    'Rohit Sharma', 'Aditya Bose', 'Kavya Reddy', 'Nikhil Jain', 'Simran Kaur',
    'Vivek Kulkarni', 'Anjali Naik', 'Pratik Wagh', 'Sakshi More', 'Tejas Shinde',
  ];
  const METHODS = ['UPI', 'UPI', 'UPI', 'Cash', 'Card', 'DD'];
  const AMOUNTS = [2999, 4999, 2999, 9999, 4999, 2999, 7499, 2999];

  for (let t = 0; t < SCHOOLS.length; t++) {
    const school = SCHOOLS[t];
    const schoolStudents = PAYMENT_STUDENTS.slice(t * 6, t * 6 + 7);
    for (let i = 0; i < schoolStudents.length; i++) {
      await prisma.payment.create({
        data: {
          tenant_id: school.id,
          student: schoolStudents[i],
          amount: AMOUNTS[i % AMOUNTS.length],
          method: METHODS[i % METHODS.length],
          status: 'paid',
          receipt_no: `RCP-${school.slug.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, '0')}`,
          created_at: daysAgo(i * 2 + 1),
        },
      });
    }
  }
  console.log(`  ✓ ${SCHOOLS.length * 7} payments`);

  // ── Plans ─────────────────────────────────────────────────────────────────
  console.log('Creating plans...');
  const plans = [
    { name: 'free',    max_students: 20,  max_courses: 2,  monthly_price: 0,     features_json: { labs: false, certificates: false } },
    { name: 'starter', max_students: 60,  max_courses: 10, monthly_price: 499900, features_json: { labs: true,  certificates: true  } },
    { name: 'pro',     max_students: 500, max_courses: 50, monthly_price: 999900, features_json: { labs: true,  certificates: true, branding: true } },
  ];
  for (const p of plans) {
    await prisma.plan.upsert({ where: { name: p.name }, update: {}, create: p });
  }
  console.log('  ✓ 3 plans');

  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n✅ Demo seed complete!\n');
  console.log('════════════════════════════════════════════');
  console.log('            LOGIN CREDENTIALS               ');
  console.log('════════════════════════════════════════════');
  console.log('Super Admin   : super@iotlearn.in / Super@1234');
  console.log('');
  console.log('── Greenfield IoT Academy ──────────────────');
  console.log('Admin         : admin@greenfield.edu / Admin@1234');
  console.log('Student 1     : arjun@greenfield.edu / Student@1234');
  console.log('Student 2     : sneha@greenfield.edu / Student@1234');
  console.log('');
  console.log('── Delhi Smart School ──────────────────────');
  console.log('Admin         : admin@delhismart.edu / Admin@1234');
  console.log('Student       : aditya@delhismart.edu / Student@1234');
  console.log('');
  console.log('── Mumbai Tech Institute ───────────────────');
  console.log('Admin         : admin@mumbaitech.edu / Admin@1234');
  console.log('Student       : vivek@mumbaitech.edu / Student@1234');
  console.log('════════════════════════════════════════════\n');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
