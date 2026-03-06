import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  enroll(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.enroll(dto);
  }

  @Get('user/:userId')
  getEnrollments(@Param('userId') userId: string) {
    return this.enrollmentsService.getEnrollments(userId);
  }

  @Patch(':courseId/progress')
  updateProgress(
    @Param('courseId') courseId: string,
    @Body() body: { user_id: string; progress_pct: number },
  ) {
    return this.enrollmentsService.updateProgress(body.user_id, courseId, body.progress_pct);
  }
}
