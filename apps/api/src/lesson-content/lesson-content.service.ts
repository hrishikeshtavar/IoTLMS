import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LessonContentService {
  constructor(private prisma: PrismaService) {}

  async upsert(dto: { lesson_id: string; locale: string; content_json: any; note?: string }) {
    const existing = await this.prisma.lessonContent.findUnique({
      where: { lesson_id_locale: { lesson_id: dto.lesson_id, locale: dto.locale } },
    });
    const nextVersion = existing ? existing.version + 1 : 1;
    if (existing) {
      await this.prisma.contentVersion.create({
        data: { content_id: existing.id, locale: existing.locale, version_no: existing.version, content_json: existing.content_json, note: dto.note },
      });
    }
    return this.prisma.lessonContent.upsert({
      where: { lesson_id_locale: { lesson_id: dto.lesson_id, locale: dto.locale } },
      create: { lesson_id: dto.lesson_id, locale: dto.locale, content_json: dto.content_json as any, version: 1, status: 'draft' },
      update: { content_json: dto.content_json as any, version: nextVersion, status: 'draft' },
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.lessonContent.findMany({ where: { lesson_id: lessonId } });
  }

  async getByLesson(lessonId: string) {
    return this.findByLesson(lessonId);
  }

  async updateStatus(id: string, status: string, approvedBy?: string) {
    return this.prisma.lessonContent.update({
      where: { id },
      data: { status, ...(approvedBy ? { approved_by: approvedBy } : {}) },
    });
  }

  async getVersionHistory(contentId: string) {
    return this.prisma.contentVersion.findMany({
      where: { content_id: contentId },
      orderBy: { version_no: 'desc' },
    });
  }

  async getVersions(contentId: string) {
    return this.getVersionHistory(contentId);
  }
}
