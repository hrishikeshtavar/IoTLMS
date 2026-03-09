import { Controller, Req, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('course/:courseId')
  @Public()
  findByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.findByCourse(courseId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Post()
  @Roles('teacher', 'content_manager', 'school_admin', 'super_admin')
  create(@Body() body: any) {
    return this.lessonsService.create(body);
  }

  @Patch(':id')
  @Roles('teacher', 'content_manager', 'school_admin', 'super_admin')
  update(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.update(id, body);
  }

  @Delete(':id')
  @Roles('school_admin', 'super_admin')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Post(':id/content')
  @Roles('teacher', 'content_manager', 'school_admin', 'super_admin')
  saveContent(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.lessonsService.saveContent(id, body.locale || 'en', body.content_json, req.user?.id);
  }

  @Get(':id/content')
  @Public()
  getContent(@Param('id') id: string, @Query('locale') locale = 'en') {
    return this.lessonsService.getContent(id, locale);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @Req() req: any) {
    return this.lessonsService.markComplete(id, req.user.id, req.tenantId);
  }

  }