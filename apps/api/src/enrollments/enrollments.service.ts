import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(dto: CreateEnrollmentDto) {
    const existing = await this.prisma.enrollment.findFirst({
      where: {
        user_id: dto.user_id,
        course_id: dto.course_id,
      },
    });

    if (existing) return { ...existing, already_enrolled: true };

    return this.prisma.enrollment.create({
      data: {
        user_id: dto.user_id,
        course_id: dto.course_id,
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
}

  async updateProgress(userId: string, courseId: string, progressPct: number) {
    return this.prisma.enrollment.updateMany({
      where: { user_id: userId, course_id: courseId },
      data: {
        progress_pct: progressPct,
        completed_at: progressPct >= 100 ? new Date() : null,
      },
    });
  }
