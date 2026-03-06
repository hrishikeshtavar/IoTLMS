import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UpsertLessonContentDto } from './dto/upsert-lesson-content.dto';

@Injectable()
export class LessonContentService {
  constructor(private prisma: PrismaService) {}

  async upsert(dto: UpsertLessonContentDto, createdBy?: string) {
    const existing = await this.prisma.lessonContent.findUnique({
      where: { lesson_id_locale: { lesson_id: dto.lesson_id, locale: dto.locale } },
    });

    const nextVersion = existing ? existing.version + 1 : 1;

    if (existing) {
      await this.prisma.contentVersion.create({
        data: {
          content_id: existing.id,
          locale: existing.locale,
          version_no: existing.version,
          content_json: existing.content_json,
          created_by: createdBy,
          note: dto.note,
        },
      });
    }

    return this.prisma.lessonContent.upsert({
      where: { lesson_id_locale: { lesson_id: dto.lesson_id, locale: dto.locale } },
      create: {
        lesson_id: dto.lesson_id,
        locale: dto.locale,
        content_json: dto.content_json as Prisma.InputJsonValue,
        version: 1,
        status: 'draft',
      },
      update: {
        content_json: dto.content_json as Prisma.InputJsonValue,
        version: nextVersion,
        status: 'draft',
      },
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.lessonContent.findMany({ where: { lesson_id: lessonId } });
  }

  async updateStatus(id: string, status: string, approvedBy?: string) {
    return this.prisma.lessonContent.update({
      where: { id },
      data: { status, approved_by: approvedBy ?? null },
    });
  }

  async getVersionHistory(contentId: string) {
    return this.prisma.contentVersion.findMany({
      where: { content_id: contentId },
      orderBy: { version_no: 'desc' },
    });
  }
}
