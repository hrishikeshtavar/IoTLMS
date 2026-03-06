import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { course_id: courseId },
      orderBy: { order_index: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.lesson.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }

  async saveContent(lessonId: string, locale: string, contentJson: Record<string, unknown>, userId?: string) {
    const existing = await this.prisma.lessonContent.findFirst({
      where: { lesson_id: lessonId, locale },
      orderBy: { version: 'desc' },
    });

    const nextVersion = existing ? existing.version + 1 : 1;

    if (existing) {
      await this.prisma.contentVersion.create({
        data: {
          content_id: existing.id,
          locale,
          version_no: existing.version,
          content_json: existing.content_json,
          created_by: userId,
        },
      });

      return this.prisma.lessonContent.update({
        where: { id: existing.id },
        data: {
          content_json: contentJson as Prisma.InputJsonValue,
          version: nextVersion,
          status: 'draft',
        },
      });
    }

    return this.prisma.lessonContent.create({
      data: {
        lesson_id: lessonId,
        locale,
        content_json: contentJson as Prisma.InputJsonValue,
        version: nextVersion,
        status: 'draft',
      },
    });
  }

  async getContent(lessonId: string, locale: string) {
    const content = await this.prisma.lessonContent.findFirst({
      where: { lesson_id: lessonId, locale },
    });
    if (content) return content;
    return this.prisma.lessonContent.findFirst({
      where: { lesson_id: lessonId, locale: 'en' },
    });
  }
}
