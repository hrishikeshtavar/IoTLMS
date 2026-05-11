import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Post()
  @Roles('admin', 'super_admin')
  createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.assessmentsService.createAssessment(dto);
  }

  @Post('questions')
  @Roles('admin', 'super_admin')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.assessmentsService.createQuestion(dto);
  }

  @Get('by-lesson/:lessonId')
  @Public()
  getByLesson(@Param('lessonId') lessonId: string) {
    return this.assessmentsService.getAssessmentByLesson(lessonId);
  }

  @Get(':id')
  @Public()
  getAssessment(@Param('id') id: string) {
    return this.assessmentsService.getAssessmentWithQuestions(id);
  }

  @Post('submit')
  submitAnswers(@Body() dto: SubmitAnswersDto) {
    return this.assessmentsService.submitAnswers(dto);
  }
}
