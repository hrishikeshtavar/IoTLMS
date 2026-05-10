import { Injectable } from '@nestjs/common';
import { GamificationService } from '../gamification/gamification.service';
import { PrismaService } from '../prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService, private gamification: GamificationService) {}

  async create(dto: CreateLessonDto) {
    const count = await this.prisma.lesson.count({ where: { course_id: dto.course_id } });
    return this.prisma.lesson.create({ data: { ...dto, order_index: count } });
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
    return this.prisma.lessonContent.findMany({ where: { lesson_id: lessonId, locale } });
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
    // 1. Load lesson + all sibling lessons in the course
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { course: { include: { lessons: { select: { id: true } } } } },
    });
    if (!lesson) return { ok: false, message: 'Lesson not found' };

    const courseId = lesson.course_id;
    const totalLessons = lesson.course.lessons.length;
    const courseTenantId = lesson.course.tenant_id;

    // 2. Check if already completed (idempotent)
    const alreadyDone = await this.prisma.userActivity.findFirst({
      where: { user_id: userId, activity_type: 'lesson_complete', entity_id: lessonId },
    });

    if (!alreadyDone) {
      // 3. Record activity only if first time
      await this.gamification.recordActivity(userId, courseTenantId, 'lesson_complete', lessonId);
    }

    // 4. Count distinct lessons completed by this user in this course
    const allLessonIds = lesson.course.lessons.map(l => l.id);
    const completedActivities = await this.prisma.userActivity.findMany({
      where: {
        user_id: userId,
        activity_type: 'lesson_complete',
        entity_id: { in: allLessonIds },
      },
      distinct: ['entity_id'],
    });
    const completedCount = completedActivities.length;
    const progress = Math.min(Math.round((completedCount / totalLessons) * 100), 100);

    // 5. Get or create enrollment
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: { user_id: userId, course_id: courseId },
    });

    if (existingEnrollment) {
      await this.prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          progress_pct: progress,
          completed_at: progress >= 100 ? (existingEnrollment.completed_at ?? new Date()) : null,
        },
      });
    } else {
      await this.prisma.enrollment.create({
        data: {
          user_id: userId,
          course_id: courseId,
          tenant_id: courseTenantId,
          progress_pct: progress,
          completed_at: progress >= 100 ? new Date() : null,
        },
      });
    }

    return {
      ok: true,
      already_completed: !!alreadyDone,
      progress_pct: progress,
      completed_lessons: completedCount,
      total_lessons: totalLessons,
      course_completed: progress >= 100,
      courseId,
    };
  }

  // Return which lessons a user has completed in a course
  async getCompletedLessons(courseId: string, userId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { course_id: courseId },
      select: { id: true },
    });
    const lessonIds = lessons.map(l => l.id);
    const activities = await this.prisma.userActivity.findMany({
      where: { user_id: userId, activity_type: 'lesson_complete', entity_id: { in: lessonIds } },
      distinct: ['entity_id'],
      select: { entity_id: true },
    });
    return { completed: activities.map(a => a.entity_id) };
  }
}
