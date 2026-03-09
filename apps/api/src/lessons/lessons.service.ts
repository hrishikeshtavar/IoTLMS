import { Injectable } from '@nestjs/common';
import { GamificationService } from '../gamification/gamification.service';
import { PrismaService } from '../prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService, private gamification: GamificationService) {}

  async create(dto: CreateLessonDto) {
    const count = await this.prisma.lesson.count({ where: { course_id: dto.course_id } });
    return this.prisma.lesson.create({
      data: { ...dto, order_index: count },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { course_id: courseId },
      orderBy: { order_index: 'asc' },
      include: { assessments: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: { assessments: { include: { questions: true } } },
    });
  }

  async update(id: string, data: Partial<CreateLessonDto>) {
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }

  async getContent(lessonId: string, locale: string) {
    return this.prisma.lessonContent.findMany({
      where: { lesson_id: lessonId, locale },
    });
  }

  async saveContent(lessonId: string, locale: string, contentJson: any, userId?: string) {
    const existing = await this.prisma.lessonContent.findUnique({
      where: { lesson_id_locale: { lesson_id: lessonId, locale } },
    });
    const nextVersion = existing ? existing.version + 1 : 1;
    return this.prisma.lessonContent.upsert({
      where: { lesson_id_locale: { lesson_id: lessonId, locale } },
      create: { lesson_id: lessonId, locale, content_json: contentJson as any, version: 1, status: 'draft' },
      update: { content_json: contentJson as any, version: nextVersion },
    });
  }

  async markComplete(lessonId: string, userId: string, tenantId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, course: { tenant_id: tenantId } },
      include: { course: { include: { lessons: true } } },
    });
    if (!lesson) return { ok: false };

    const totalLessons = lesson.course.lessons.length;
    const courseId = lesson.course_id;

    // Get or create enrollment
    let enrollment = await this.prisma.enrollment.findFirst({
      where: { user_id: userId, course_id: courseId },
    });
    if (!enrollment) {
      enrollment = await this.prisma.enrollment.create({
        data: { user_id: userId, course_id: courseId },
      });
    }

    // Recalculate progress (naive: count distinct completed lessons via submissions + this one)
    const newProgress = Math.min(
      Math.round(((enrollment.progress_pct / 100) * totalLessons + 1) / totalLessons * 100),
      100,
    );

    await this.prisma.enrollment.updateMany({
      where: { user_id: userId, course_id: courseId },
      data: {
        progress_pct: newProgress,
        completed_at: newProgress >= 100 ? new Date() : null,
      },
    });

    await this.gamification.recordActivity(userId, tenantId, 'lesson_complete', lessonId);
    return { ok: true, progress_pct: newProgress, courseId };
  }

  }