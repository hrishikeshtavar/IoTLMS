import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async createAssessment(dto: any) {
    return this.prisma.assessment.create({ data: dto });
  }

  async createQuestion(dto: any) {
    return this.prisma.question.create({
      data: {
        assessment_id: dto.assessment_id,
        question_text: dto.question_text,
        options_json: dto.options_json,
        correct_answer: dto.correct_answer,
        points: dto.points,
      },
    });
  }

  private transformQuestions(assessment: any) {
    if (!assessment) return assessment;
    return {
      ...assessment,
      questions: (assessment.questions || []).map((q: any) => ({
        ...q,
        options_json: Array.isArray(q.options_json)
          ? q.options_json.map((opt: any, i: number) =>
              typeof opt === 'string' ? { value: String(i), label: opt } : opt
            )
          : q.options_json,
      })),
    };
  }

  async getAssessmentByLesson(lessonId: string) {
    const a = await this.prisma.assessment.findFirst({ where: { lesson_id: lessonId }, include: { questions: true } });
    return this.transformQuestions(a);
  }

  async getAssessmentWithQuestions(id: string) {
    const a = await this.prisma.assessment.findUnique({ where: { id }, include: { questions: true } });
    return this.transformQuestions(a);
  }

  async submitAnswers(dto: any) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: dto.assessment_id },
      include: { questions: true },
    });
    if (!assessment) throw new Error('Assessment not found');
    let score = 0;
    const results = dto.answers.map((answer: any) => {
      const question = assessment.questions.find(q => q.id === answer.question_id);
      const correct = question?.correct_answer === answer.answer;
      if (correct) score += question?.points ?? 0;
      return {
        question_id: answer.question_id,
        submitted: answer.answer,
        correct_answer: question?.correct_answer,
        is_correct: correct,
        points_earned: correct ? question?.points ?? 0 : 0,
      };
    });
    const dynamicMaxScore = assessment.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
    const passThreshold = assessment.max_score > 0
      ? Math.round((assessment.pass_score / assessment.max_score) * dynamicMaxScore)
      : assessment.pass_score;
    const passed = score >= passThreshold;
    const submission = await this.prisma.submission.create({
      data: {
        user_id: dto.user_id,
        assessment_id: dto.assessment_id,
        answers_json: dto.answers,
        score,
        passed,
      },
    });
    return {
      submission_id: submission.id,
      score,
      max_score: dynamicMaxScore,
      pass_score: passThreshold,
      passed,
      percentage: dynamicMaxScore > 0 ? Math.round((score / dynamicMaxScore) * 100) : 0,
      results,
    };
  }

  async getTenantStats(tenantId: string) {
    const assessments = await this.prisma.assessment.findMany({
      where: { lesson: { course: { tenant_id: tenantId } } },
      include: {
        questions: { select: { id: true } },
        lesson: { select: { id: true, title: true, course: { select: { id: true, title_en: true } } } },
        submissions: {
          select: { id: true, score: true, passed: true, graded_at: true },
          orderBy: { graded_at: 'desc' },
        },
      },
    });
    return assessments.map(a => {
      const total = (a as any).submissions.length;
      const passedCount = (a as any).submissions.filter((s: any) => s.passed).length;
      const avgScore = total > 0
        ? Math.round((a as any).submissions.reduce((sum: number, s: any) =>
            sum + (a.max_score > 0 ? (s.score / a.max_score) * 100 : 0), 0) / total)
        : 0;
      return {
        id: a.id,
        lessonTitle: (a as any).lesson?.title,
        courseTitle: (a as any).lesson?.course?.title_en,
        courseId: (a as any).lesson?.course?.id,
        questionCount: (a as any).questions.length,
        passScore: a.pass_score,
        maxScore: a.max_score,
        totalSubmissions: total,
        passedCount,
        passRate: total > 0 ? Math.round((passedCount / total) * 100) : 0,
        avgScore,
        lastSubmission: (a as any).submissions[0]?.graded_at ?? null,
      };
    });
  }
}
