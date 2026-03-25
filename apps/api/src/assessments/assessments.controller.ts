import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Post()
  createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.assessmentsService.createAssessment(dto);
  }

  @Post('questions')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.assessmentsService.createQuestion(dto);
  }

  @Get('by-lesson/:lessonId')
  getByLesson(@Param('lessonId') lessonId: string) {
    return this.assessmentsService.getAssessmentByLesson(lessonId);
  }

  @Get(':id')
  getAssessment(@Param('id') id: string) {
    return this.assessmentsService.getAssessmentWithQuestions(id);
  }

  @Post('submit')
  submitAnswers(@Body() dto: SubmitAnswersDto) {
    return this.assessmentsService.submitAnswers(dto);
  }
}
