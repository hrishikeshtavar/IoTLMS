import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../auth/email.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService, private emailService: EmailService) {}

  async enroll(dto: CreateEnrollmentDto) {
    const existing = await this.prisma.enrollment.findFirst({
      where: { user_id: dto.user_id, course_id: dto.course_id },
    });

    if (existing) return { ...existing, already_enrolled: true };

    return this.prisma.enrollment.create({
      data: {
        user_id: dto.user_id,
        course_id: dto.course_id,
        tenant_id: dto.tenant_id,
      },
      include: { course: true },
    });
  }

  async getEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { user_id: userId },
      include: { course: true },
      orderBy: { enrolled_at: 'desc' },
    });
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progressPct: number,
    tenantId: string,
  ) {
    const clampedPct = Math.min(Math.round(progressPct), 100);

    const existing = await this.prisma.enrollment.findFirst({
      where: { user_id: userId, course_id: courseId },
    });

    if (existing) {
      return this.prisma.enrollment.update({
        where: { id: existing.id },
        data: {
          progress_pct: clampedPct,
          completed_at: clampedPct >= 100
            ? existing.completed_at ?? new Date()
            : null,
        },
      });
    }

    // Auto-enroll if not already enrolled
    return this.prisma.enrollment.create({
      data: {
        user_id: userId,
        course_id: courseId,
        tenant_id: tenantId,
        progress_pct: clampedPct,
        completed_at: clampedPct >= 100 ? new Date() : null,
      },
    });
  }

  async getAllByTenant(tenantId: string) {
    return this.prisma.enrollment.findMany({
      where: { tenant_id: tenantId },
      include: {
        course: { select: { id: true, title_en: true, category: true, tenant_id: true } },
        user: { select: { id: true, name: true, email: true, username: true, class_grade: true, division: true } },
      },
      orderBy: { enrolled_at: 'desc' },
    });
  }

  async sendEnrollmentReminders(tenantId: string) {
    // Find all students with no enrollments
    const allStudents = await this.prisma.user.findMany({
      where: { tenant_id: tenantId, role: 'student', is_active: true },
      select: { id: true, name: true, email: true },
    });

    const enrolledUserIds = await this.prisma.enrollment.findMany({
      where: { tenant_id: tenantId },
      select: { user_id: true },
      distinct: ['user_id'],
    }).then(e => new Set(e.map(x => x.user_id)));

    const unenrolled = allStudents.filter(s => !enrolledUserIds.has(s.id) && s.email);

    let sent = 0;
    for (const student of unenrolled) {
      if (!student.email) continue;
      await this.emailService.sendEnrollmentReminder(student.email, student.name).catch(() => {});
      sent++;
    }

    return { sent, total: unenrolled.length, message: `Reminder sent to ${sent} unenrolled students` };
  }
}
