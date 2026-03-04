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

  async getAssessmentWithQuestions(id: string) {
    return this.prisma.assessment.findUnique({
      where: { id },
      include: { questions: true },
    });
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

    const passed = score >= assessment.pass_score;

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
      max_score: assessment.max_score,
      pass_score: assessment.pass_score,
      passed,
      percentage: Math.round((score / assessment.max_score) * 100),
      results,
    };
  }
}
