import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Public()
  findAll(@Req() req: any) {
    return this.coursesService.findAll(req.tenantId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.findOne(id, req.tenantId);
  }

  @Post()
  @Roles('teacher', 'content_manager', 'school_admin', 'super_admin')
  create(@Body() body: any, @Req() req: any) {
    return this.coursesService.create(body, req.tenantId);
  }

  @Patch(':id')
  @Roles('teacher', 'content_manager', 'school_admin', 'super_admin')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.coursesService.update(id, body, req.tenantId);
  }

  @Patch(':id/status')
  @Roles('school_admin', 'super_admin')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.coursesService.updateStatus(id, status, req.tenantId);
  }

  @Delete(':id')
  @Roles('school_admin', 'super_admin')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.remove(id, req.tenantId);
  }
}
