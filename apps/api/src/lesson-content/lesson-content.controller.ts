import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { LessonContentService } from './lesson-content.service';
import { UpsertLessonContentDto } from './dto/upsert-lesson-content.dto';

@Controller('lesson-content')
export class LessonContentController {
  constructor(private svc: LessonContentService) {}

  @Post()
  upsert(@Body() dto: UpsertLessonContentDto) {
    return this.svc.upsert(dto);
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.svc.findByLesson(lessonId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; approved_by?: string }) {
    return this.svc.updateStatus(id, body.status, body.approved_by);
  }

  @Get(':id/versions')
  getVersionHistory(@Param('id') id: string) {
    return this.svc.getVersionHistory(id);
  }
}
