import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LessonContentService {
  private readonly logger = new Logger(LessonContentService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Counts blocks that actually carry authored content.
   * Used only as a data-loss guard: it must never report 0 for a payload a human
   * really authored, and must report 0 for the "empty editor" payloads ([] or a
   * single blank text block) that a mis-timed autosave can produce.
   * Returns null for non blocks_v1 payloads (legacy TipTap docs) so they are not guarded.
   */
  private meaningfulBlockCount(contentJson: any): number | null {
    if (!contentJson || typeof contentJson !== 'object') return null;
    if (contentJson.format !== 'blocks_v1') return null;
    const blocks: any[] = Array.isArray(contentJson.blocks) ? contentJson.blocks : [];
    const hasDoc = (d: any) => !!d && Array.isArray(d.content) && d.content.length > 0;
    return blocks.filter((b: any) => {
      if (!b || typeof b !== 'object') return false;
      switch (b.type) {
        case 'text':  return hasDoc(b.content_en) || hasDoc(b.content_hi) || hasDoc(b.content_mr);
        case 'video': return !!b.url;
        case 'image': return !!b.url;
        case 'lab':   return !!b.wokwi_url || !!b.instructions;
        case 'quiz':  return Array.isArray(b.questions) && b.questions.length > 0;
        default:      return true;
      }
    }).length;
  }

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
      if (questions.length > 0) {
        await this.prisma.question.deleteMany({ where: { assessment_id: assessment.id } });
      }
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

  async upsert(dto: {
    lesson_id: string;
    locale: string;
    content_json: any;
    note?: string;
    base_version?: number;
    allow_empty?: boolean;
  }) {
    const result = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.lessonContent.findUnique({
        where: { lesson_id_locale: { lesson_id: dto.lesson_id, locale: dto.locale } },
      });

      if (!existing) {
        return tx.lessonContent.create({
          data: {
            lesson_id: dto.lesson_id,
            locale: dto.locale,
            content_json: dto.content_json as any,
            version: 1,
            status: 'draft',
          },
        });
      }

      // Optimistic concurrency: a client that based its edit on an older row
      // must not silently overwrite a newer one.
      if (typeof dto.base_version === 'number' && dto.base_version !== existing.version) {
        throw new ConflictException({
          code: 'STALE_CONTENT',
          message: `Lesson content changed since it was loaded (yours: v${dto.base_version}, current: v${existing.version}). Reload the chapter before saving.`,
          current_version: existing.version,
        });
      }

      // Data-loss guard: never let an empty payload replace authored content
      // unless the caller explicitly opts in (a human pressing Save).
      const incoming = this.meaningfulBlockCount(dto.content_json);
      const stored = this.meaningfulBlockCount(existing.content_json);
      if (!dto.allow_empty && incoming === 0 && (stored ?? 0) > 0) {
        this.logger.warn(
          `[content-guard] refused empty overwrite lesson=${dto.lesson_id} locale=${dto.locale} stored_blocks=${stored} version=${existing.version}`,
        );
        throw new ConflictException({
          code: 'EMPTY_OVERWRITE_BLOCKED',
          message: 'Refusing to replace existing chapter content with an empty payload.',
          current_version: existing.version,
        });
      }

      // Archive + write in one transaction so history can never be lost halfway.
      await tx.contentVersion.create({
        data: {
          content_id: existing.id,
          locale: existing.locale,
          version_no: existing.version,
          content_json: existing.content_json as any,
          note: dto.note,
        },
      });

      return tx.lessonContent.update({
        where: { id: existing.id },
        data: {
          content_json: dto.content_json as any,
          version: existing.version + 1,
          // status intentionally preserved: saving must not silently un-approve content
        },
      });
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
