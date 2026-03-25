const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // 1. Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'greenfield' },
    update: {},
    create: {
      name: 'Greenfield IoT Academy',
      slug: 'greenfield',
      is_active: true,
      plan_id: 'starter',
    },
  });
  console.log('Tenant:', tenant.id);

  // 2. Super admin
  const superHash = await bcrypt.hash('Super@1234', 12);
  const superAdmin = await prisma.user.upsert({
    where: { id: 'super-admin-fixed-id-001' },
    update: {},
    create: {
      id: 'super-admin-fixed-id-001',
      tenant_id: tenant.id,
      name: 'Super Admin',
      email: 'super@iotlearn.in',
      role: 'super_admin',
      password_hash: superHash,
      email_verified: true,
    },
  });
  console.log('Super Admin:', superAdmin.id, superAdmin.email);

  // 3. School admin
  const adminHash = await bcrypt.hash('Admin@1234', 12);
  const schoolAdmin = await prisma.user.upsert({
    where: { id: 'school-admin-fixed-id-002' },
    update: {},
    create: {
      id: 'school-admin-fixed-id-002',
      tenant_id: tenant.id,
      name: 'Priya Sharma',
      email: 'admin@greenfield.edu',
      role: 'admin',
      password_hash: adminHash,
      email_verified: true,
    },
  });
  console.log('School Admin:', schoolAdmin.id, schoolAdmin.email);

  // 4. Students
  const studentHash = await bcrypt.hash('Student@1234', 12);
  const students = await Promise.all([
    { id: 'student-fixed-id-001', name: 'Arjun Patil',   email: 'arjun@greenfield.edu' },
    { id: 'student-fixed-id-002', name: 'Sneha Desai',   email: 'sneha@greenfield.edu' },
    { id: 'student-fixed-id-003', name: 'Rahul Nair',    email: 'rahul@greenfield.edu' },
    { id: 'student-fixed-id-004', name: 'Ananya Rao',    email: 'ananya@greenfield.edu' },
    { id: 'student-fixed-id-005', name: 'Vikram Mehta',  email: 'vikram@greenfield.edu' },
  ].map(s => prisma.user.upsert({
    where: { id: s.id },
    update: {},
    create: { ...s, tenant_id: tenant.id, role: 'student', password_hash: studentHash, email_verified: true },
  })));
  console.log('Students:', students.length);

  // 5. Courses
  const courses = await Promise.all([
    {
      id: 'course-fixed-id-001', slug: 'intro-to-iot',
      title_en: 'Introduction to IoT',
      title_hi: 'IoT का परिचय',
      description_en: 'Learn the fundamentals of Internet of Things including sensors, actuators, and connectivity.',
      level: 'beginner',
      duration_hours: 10,
      price: 49900,
      status: 'published',
    },
    {
      id: 'course-fixed-id-002', slug: 'esp32-arduino',
      title_en: 'ESP32 & Arduino Programming',
      title_hi: 'ESP32 और Arduino प्रोग्रामिंग',
      description_en: 'Master microcontroller programming with hands-on ESP32 and Arduino projects.',
      level: 'intermediate',
      duration_hours: 20,
      price: 99900,
      status: 'published',
    },
    {
      id: 'course-fixed-id-003', slug: 'industrial-iot-scada',
      title_en: 'Industrial IoT & SCADA',
      title_hi: 'औद्योगिक IoT और SCADA',
      description_en: 'Advanced course on industrial automation, MQTT, and SCADA systems.',
      level: 'advanced',
      duration_hours: 30,
      price: 149900,
      status: 'published',
    },
  ].map(c => prisma.course.upsert({
    where: { id: c.id },
    update: {},
    create: { ...c, tenant_id: tenant.id },
  })));
  console.log('Courses:', courses.length);

  // 6. Lessons for course 1
  const lessons = await Promise.all([
    { id: 'lesson-fixed-id-001', title: 'What is IoT?',           order_index: 1 },
    { id: 'lesson-fixed-id-002', title: 'Sensors & Actuators',    order_index: 2 },
    { id: 'lesson-fixed-id-003', title: 'Connectivity Protocols', order_index: 3 },
    { id: 'lesson-fixed-id-004', title: 'Cloud Platforms',        order_index: 4 },
  ].map(l => prisma.lesson.upsert({
    where: { id: l.id },
    update: {},
    create: { ...l, course_id: 'course-fixed-id-001', type: 'video', duration_min: 15 },
  })));
  console.log('Lessons:', lessons.length);

  // 7. Enrollments + progress
  const enrollments = [
    { user_id: 'student-fixed-id-001', course_id: 'course-fixed-id-001', progress_pct: 75 },
    { user_id: 'student-fixed-id-001', course_id: 'course-fixed-id-002', progress_pct: 20 },
    { user_id: 'student-fixed-id-002', course_id: 'course-fixed-id-001', progress_pct: 100, completed_at: new Date() },
    { user_id: 'student-fixed-id-003', course_id: 'course-fixed-id-001', progress_pct: 50 },
    { user_id: 'student-fixed-id-003', course_id: 'course-fixed-id-003', progress_pct: 10 },
    { user_id: 'student-fixed-id-004', course_id: 'course-fixed-id-002', progress_pct: 60 },
    { user_id: 'student-fixed-id-005', course_id: 'course-fixed-id-001', progress_pct: 100, completed_at: new Date() },
  ];
  for (const e of enrollments) {
    await prisma.enrollment.upsert({
      where: { id: `enroll-${e.user_id}-${e.course_id}` },
      update: {},
      create: { id: `enroll-${e.user_id}-${e.course_id}`, ...e },
    });
  }
  console.log('Enrollments:', enrollments.length);

  // 8. BrandKit for school
  await prisma.brandKit.upsert({
    where: { tenant_id: tenant.id },
    update: {},
    create: {
      tenant_id: tenant.id,
      colors_json: { primary: '#1A73E8', secondary: '#FF6B35', accent: '#00C896' },
      fonts_json: { heading: 'Baloo 2', body: 'Inter' },
    },
  });
  console.log('BrandKit created');

  console.log('\n✅ Seed complete!\n');
  console.log('=== LOGIN CREDENTIALS ===');
  console.log('Super Admin  : super@iotlearn.in     / Super@1234');
  console.log('School Admin : admin@greenfield.edu  / Admin@1234');
  console.log('Student 1    : arjun@greenfield.edu  / Student@1234');
  console.log('Student 2    : sneha@greenfield.edu  / Student@1234');
  console.log('\n=== IDs ===');
  console.log('Tenant ID    :', tenant.id);
  console.log('Super Admin  : super-admin-fixed-id-001');
  console.log('School Admin : school-admin-fixed-id-002');
  console.log('Course 1     : course-fixed-id-001');
  console.log('Course 2     : course-fixed-id-002');
  console.log('Course 3     : course-fixed-id-003');
}

main().catch(console.error).finally(() => prisma.$disconnect());
