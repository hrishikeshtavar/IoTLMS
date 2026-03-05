import { Injectable } from '@nestjs/common';
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

  async saveContent(lessonId: string, locale: string, contentJson: any, userId: string) {
    const existing = await this.prisma.lessonContent.findFirst({
      where: { lesson_id: lessonId, locale },
      orderBy: { version: 'desc' },
    });
    const nextVersion = existing ? existing.version + 1 : 1;

    await this.prisma.contentVersion.create({
      data: { lesson_id: lessonId, locale, content_json: contentJson, version: nextVersion, created_by: userId },
    });

    if (existing) {
      return this.prisma.lessonContent.update({
        where: { id: existing.id },
        data: { content_json: contentJson, version: nextVersion },
      });
    }
    return this.prisma.lessonContent.create({
      data: { lesson_id: lessonId, locale, content_json: contentJson, version: nextVersion },
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
