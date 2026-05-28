import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(tenantId: string) {
    const [totalStudents, totalCourses, enrollments, submissions] = await Promise.all([
      this.prisma.user.count({ where: { tenant_id: tenantId, role: 'student' } }),
      this.prisma.course.count({ where: { tenant_id: tenantId } }),
      this.prisma.enrollment.findMany({
        where: { tenant_id: tenantId },
        include: { course: true },
      }),
      this.prisma.submission.findMany({
        where: { assessment: { lesson: { course: { tenant_id: tenantId } } } },
        include: { assessment: true },
      }),
    ]);

    const completedEnrollments = enrollments.filter(e => e.completed_at).length;
    const completionRate = enrollments.length > 0
      ? Math.round((completedEnrollments / enrollments.length) * 100)
      : 0;
    const passRate = submissions.length > 0
      ? Math.round((submissions.filter(s => s.passed).length / submissions.length) * 100)
      : 0;

    const monthMap: Record<string, number> = {};
    enrollments.forEach(e => {
      const month = new Date(e.enrolled_at).toLocaleString('en', { month: 'short' });
      monthMap[month] = (monthMap[month] ?? 0) + 1;
    });
    const enrollmentTrend = Object.entries(monthMap).map(([month, enrollments]) => ({ month, enrollments }));

    const courseMap: Record<string, { title: string; enrolled: number; completed: number }> = {};
    enrollments.forEach(e => {
      const title = e.course.title_en?.slice(0, 12) ?? 'Unknown';
      if (!courseMap[e.course_id]) courseMap[e.course_id] = { title, enrolled: 0, completed: 0 };
      courseMap[e.course_id].enrolled++;
      if (e.completed_at) courseMap[e.course_id].completed++;
    });
    const coursePerformance = Object.values(courseMap);

    return {
      totalStudents,
      totalCourses,
      totalEnrollments: enrollments.length,
      completionRate,
      passRate,
      enrollmentTrend,
      coursePerformance,
    };
  }

  async getCertificateData(courseId: string, userId: string, tenantId: string) {
    const [enrollment, course, user, brandKit, tenant, submissions] = await Promise.all([
      this.prisma.enrollment.findFirst({ where: { course_id: courseId, user_id: userId } }),
      this.prisma.course.findFirst({ where: { id: courseId, tenant_id: tenantId } }),
      this.prisma.user.findFirst({ where: { id: userId } }),
      this.prisma.brandKit.findFirst({ where: tenantId ? { tenant_id: tenantId } : undefined }),
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      this.prisma.submission.findMany({
        where: { user_id: userId, assessment: { lesson: { course_id: courseId } } },
        include: { assessment: { include: { questions: true } } },
      }),
    ]);
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);
    const totalMaxScore = submissions.reduce((sum, s) => {
      const dynamic = (s as any).assessment?.questions?.reduce((acc: number, q: any) => acc + (q.points ?? 0), 0) ?? 0;
      return sum + (dynamic > 0 ? dynamic : ((s as any).assessment?.max_score ?? 100));
    }, 0);
    const pct = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 100;
    return {
      studentName: user?.name ?? 'Student',
      courseName: course?.title_en ?? 'IoT Course',
      completedDate: enrollment?.completed_at
        ? new Date(enrollment.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      score: `${pct}%`,
      certId: `IOTL-${courseId.slice(0, 8).toUpperCase()}`,
      school: tenant?.name ?? 'SimuLearning',
      primaryColor: (brandKit?.colors_json as any)?.primary ?? '#2563eb',
      logoUrl: brandKit?.logo_url ?? null,
      certTemplateUrl: (brandKit as any)?.cert_template_url ?? null,
      principalName: (brandKit as any)?.principal_name ?? null,
      principalSignatureUrl: (brandKit as any)?.principal_signature_url ?? null,
      platformDirectorName: (brandKit as any)?.platform_director_name ?? 'SimuLearning',
      platformDirectorSignatureUrl: (brandKit as any)?.platform_director_signature_url ?? null,
    };
  }
}