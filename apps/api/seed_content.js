const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding content...');

  // Lesson content for all 4 lessons of course 1
  const contents = [
    {
      id: 'content-001',
      lesson_id: 'lesson-fixed-id-001',
      locale: 'en',
      content_type: 'text',
      body: `<h2>What is IoT?</h2>
<p>The <strong>Internet of Things (IoT)</strong> refers to the network of physical devices embedded with sensors, software, and connectivity that enables them to collect and exchange data.</p>
<h3>Key Components</h3>
<ul>
  <li><strong>Sensors</strong> – Collect data from the environment (temperature, humidity, motion)</li>
  <li><strong>Connectivity</strong> – Wi-Fi, Bluetooth, Zigbee, LoRa</li>
  <li><strong>Processing</strong> – Microcontrollers and edge computing</li>
  <li><strong>Cloud</strong> – Store, analyze, and visualize data</li>
  <li><strong>Applications</strong> – Smart homes, agriculture, healthcare, industry</li>
</ul>
<h3>Real World Examples</h3>
<p>Smart thermostats like Nest, fitness trackers, connected cars, and industrial sensors are all IoT devices. By 2030, over 25 billion IoT devices are expected to be connected worldwide.</p>`,
      status: 'published',
    },
    {
      id: 'content-002',
      lesson_id: 'lesson-fixed-id-002',
      locale: 'en',
      content_type: 'text',
      body: `<h2>Sensors & Actuators</h2>
<p>Sensors and actuators are the eyes, ears, and hands of an IoT system.</p>
<h3>Common Sensors</h3>
<ul>
  <li><strong>DHT11/DHT22</strong> – Temperature and humidity</li>
  <li><strong>HC-SR04</strong> – Ultrasonic distance</li>
  <li><strong>PIR</strong> – Motion detection</li>
  <li><strong>MQ-2</strong> – Gas and smoke detection</li>
  <li><strong>BMP280</strong> – Barometric pressure</li>
</ul>
<h3>Common Actuators</h3>
<ul>
  <li><strong>Servo Motor</strong> – Precise angular control</li>
  <li><strong>Relay Module</strong> – Control high-voltage devices</li>
  <li><strong>LED / Buzzer</strong> – Visual and audio feedback</li>
  <li><strong>Solenoid Valve</strong> – Control fluid flow</li>
</ul>
<h3>How They Work Together</h3>
<p>A sensor detects a condition (e.g., temperature too high), the microcontroller processes this data, and an actuator responds (e.g., fan turns on).</p>`,
      status: 'published',
    },
    {
      id: 'content-003',
      lesson_id: 'lesson-fixed-id-003',
      locale: 'en',
      content_type: 'text',
      body: `<h2>Connectivity Protocols</h2>
<p>Choosing the right communication protocol is critical in IoT design.</p>
<h3>Short Range</h3>
<ul>
  <li><strong>Wi-Fi</strong> – High bandwidth, high power. Good for home IoT.</li>
  <li><strong>Bluetooth LE</strong> – Low power, short range. Good for wearables.</li>
  <li><strong>Zigbee</strong> – Mesh network, low power. Good for smart home sensors.</li>
</ul>
<h3>Long Range</h3>
<ul>
  <li><strong>LoRaWAN</strong> – Kilometers of range, very low power. Perfect for agriculture.</li>
  <li><strong>NB-IoT</strong> – Uses cellular networks. Good for smart meters.</li>
  <li><strong>LTE-M</strong> – Mobile IoT with moderate bandwidth.</li>
</ul>
<h3>Messaging Protocols</h3>
<ul>
  <li><strong>MQTT</strong> – Lightweight publish/subscribe. Most popular for IoT.</li>
  <li><strong>HTTP/REST</strong> – Standard web protocol, higher overhead.</li>
  <li><strong>CoAP</strong> – Constrained devices over UDP.</li>
</ul>`,
      status: 'published',
    },
    {
      id: 'content-004',
      lesson_id: 'lesson-fixed-id-004',
      locale: 'en',
      content_type: 'text',
      body: `<h2>Cloud Platforms for IoT</h2>
<p>Cloud platforms provide the backbone for storing, processing, and visualizing IoT data at scale.</p>
<h3>Major Platforms</h3>
<ul>
  <li><strong>AWS IoT Core</strong> – Scalable, secure device connectivity from Amazon</li>
  <li><strong>Google Cloud IoT</strong> – Integrated with BigQuery and ML tools</li>
  <li><strong>Azure IoT Hub</strong> – Microsoft's enterprise IoT solution</li>
  <li><strong>Blynk</strong> – Easy mobile dashboard for hobbyists</li>
  <li><strong>ThingSpeak</strong> – Free MATLAB-powered analytics</li>
</ul>
<h3>Key Features to Look For</h3>
<ul>
  <li>Device management and OTA updates</li>
  <li>Real-time data streaming</li>
  <li>Alerting and notifications</li>
  <li>Data visualization dashboards</li>
  <li>Security and authentication</li>
</ul>`,
      status: 'published',
    },
  ];

  for (const c of contents) {
    await prisma.lessonContent.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }
  console.log('Lesson content created:', contents.length);

  // Assessment for lesson 1
  const assessment = await prisma.assessment.upsert({
    where: { id: 'assessment-fixed-id-001' },
    update: {},
    create: {
      id: 'assessment-fixed-id-001',
      lesson_id: 'lesson-fixed-id-001',
      title: 'IoT Basics Quiz',
      pass_score: 60,
    },
  });
  console.log('Assessment created:', assessment.id);

  // Quiz questions
  const questions = [
    {
      id: 'q-001',
      assessment_id: 'assessment-fixed-id-001',
      question_text: 'What does IoT stand for?',
      options: ['Internet of Things', 'Integrated Operation Technology', 'Internet of Technology', 'Input Output Terminal'],
      correct_index: 0,
      explanation: 'IoT stands for Internet of Things — a network of connected physical devices.',
    },
    {
      id: 'q-002',
      assessment_id: 'assessment-fixed-id-001',
      question_text: 'Which sensor is used to measure temperature and humidity?',
      options: ['HC-SR04', 'PIR', 'DHT11', 'MQ-2'],
      correct_index: 2,
      explanation: 'DHT11 and DHT22 are popular sensors for measuring both temperature and humidity.',
    },
    {
      id: 'q-003',
      assessment_id: 'assessment-fixed-id-001',
      question_text: 'Which protocol is most commonly used for IoT messaging?',
      options: ['HTTP', 'MQTT', 'FTP', 'SMTP'],
      correct_index: 1,
      explanation: 'MQTT (Message Queuing Telemetry Transport) is lightweight and ideal for IoT devices.',
    },
    {
      id: 'q-004',
      assessment_id: 'assessment-fixed-id-001',
      question_text: 'Which of the following is a long-range IoT connectivity option?',
      options: ['Bluetooth LE', 'Zigbee', 'LoRaWAN', 'Wi-Fi'],
      correct_index: 2,
      explanation: 'LoRaWAN can transmit data over several kilometers with very low power consumption.',
    },
    {
      id: 'q-005',
      assessment_id: 'assessment-fixed-id-001',
      question_text: 'What is the role of an actuator in an IoT system?',
      options: ['Collect data from environment', 'Store data in the cloud', 'Perform a physical action based on commands', 'Encrypt data'],
      correct_index: 2,
      explanation: 'Actuators perform physical actions (like turning on a motor) based on processed data.',
    },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: {
        ...q,
        options: q.options,
      },
    });
  }
  console.log('Questions created:', questions.length);

  // Assessment for lesson 2
  const assessment2 = await prisma.assessment.upsert({
    where: { id: 'assessment-fixed-id-002' },
    update: {},
    create: {
      id: 'assessment-fixed-id-002',
      lesson_id: 'lesson-fixed-id-002',
      title: 'Sensors & Actuators Quiz',
      pass_score: 60,
    },
  });

  const questions2 = [
    {
      id: 'q-006',
      assessment_id: 'assessment-fixed-id-002',
      question_text: 'What does a PIR sensor detect?',
      options: ['Temperature', 'Motion', 'Gas', 'Distance'],
      correct_index: 1,
      explanation: 'PIR (Passive Infrared) sensors detect motion by measuring infrared radiation.',
    },
    {
      id: 'q-007',
      assessment_id: 'assessment-fixed-id-002',
      question_text: 'Which actuator would you use to control a high-voltage appliance?',
      options: ['Servo Motor', 'LED', 'Relay Module', 'Buzzer'],
      correct_index: 2,
      explanation: 'A relay module acts as an electrically operated switch for high-voltage devices.',
    },
    {
      id: 'q-008',
      assessment_id: 'assessment-fixed-id-002',
      question_text: 'What is the HC-SR04 sensor used for?',
      options: ['Humidity measurement', 'Gas detection', 'Ultrasonic distance measurement', 'Light intensity'],
      correct_index: 2,
      explanation: 'HC-SR04 uses ultrasonic waves to measure distance accurately.',
    },
  ];

  for (const q of questions2) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: { ...q, options: q.options },
    });
  }
  console.log('Questions 2 created:', questions2.length);

  console.log('\n✅ Content seed complete!');
  console.log('Course 1 now has:');
  console.log('  - 4 lessons with full text content');
  console.log('  - 2 quizzes (5 + 3 questions)');
  console.log('\nTest at:');
  console.log('  http://localhost:3000/courses/course-fixed-id-001');
}

main().catch(console.error).finally(() => prisma.$disconnect());
