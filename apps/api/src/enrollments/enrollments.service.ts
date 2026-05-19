import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

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
}
