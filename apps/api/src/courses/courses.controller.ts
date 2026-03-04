import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(@Req() req, @Query('locale') locale: string = 'en') {
    const tenantId = req['tenantId'];
    return this.coursesService.findAll(tenantId, locale);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const tenantId = req['tenantId'];
    return this.coursesService.findOne(id, tenantId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateCourseDto) {
    const tenantId = req['tenantId'];
    return this.coursesService.create(tenantId, dto);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: Partial<CreateCourseDto>) {
    const tenantId = req['tenantId'];
    return this.coursesService.update(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const tenantId = req['tenantId'];
    return this.coursesService.remove(id, tenantId);
  }
}
