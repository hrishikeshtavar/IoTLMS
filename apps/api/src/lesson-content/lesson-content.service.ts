import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LessonContentService {
  constructor(private prisma: PrismaService) {}

  private async syncQuizToAssessment(lessonId: string, quizBlock: any) {
    const questions: any[] = quizBlock.questions || [];
    const maxScore = questions.reduce((s: number, q: any) => s + (q.points ?? 10), 0);
    let assessment = await this.prisma.assessment.findFirst({ where: { lesson_id: lessonId } });
    if (!assessment) {
      assessment = await this.prisma.assessment.create({
        data: { lesson_id: lessonId, pass_score: quizBlock.pass_score ?? 60, max_score: maxScore },
      });
    } else {
      await this.prisma.assessment.update({
        where: { id: assessment.id },
        data: { pass_score: quizBlock.pass_score ?? 60, max_score: maxScore },
      });
      await this.prisma.question.deleteMany({ where: { assessment_id: assessment.id } });
    }
    for (const q of questions) {
      const effectiveOptions = q.qtype === 'truefalse' ? ['True', 'False'] : (q.options || []);
      const correctAnswer = String(q.correct ?? 0);
      await this.prisma.question.create({
        data: {
          assessment_id: assessment.id,
          question_text: q.text,
          options_json: effectiveOptions,
          correct_answer: correctAnswer,
          points: q.points ?? 10,
        },
      }).catch((e: any) => console.error('[QuizSync] question create failed:', e?.message));
    }
  }

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
    const result = await this.prisma.lessonContent.upsert({
      where: { lesson_id_locale: { lesson_id: dto.lesson_id, locale: dto.locale } },
      create: { lesson_id: dto.lesson_id, locale: dto.locale, content_json: dto.content_json as any, version: 1, status: 'draft' },
      update: { content_json: dto.content_json as any, version: nextVersion, status: 'draft' },
    });
    const blocks: any[] = (dto.content_json as any)?.blocks ?? [];
    const quizBlock = blocks.find((b: any) => b.type === 'quiz');
    if (quizBlock && dto.locale === 'en') {
      await this.syncQuizToAssessment(dto.lesson_id, quizBlock).catch((e) => console.error('[QuizSync] failed:', e));
    }
    return result;
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
