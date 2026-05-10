import { Controller, Get, Query, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @Public()
  search(@Query('q') q = '', @Query('tenantId') tenantId?: string) {
    return this.searchService.searchAll(q, tenantId);
  }

  @Get('courses')
  @Public()
  courses(
    @Query('q') q = '',
    @Query('tenantId') tenantId?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    return this.searchService.searchCourses(q, tenantId, { category, level });
  }

  @Get('lessons')
  @Public()
  lessons(@Query('q') q = '', @Query('courseId') courseId?: string) {
    return this.searchService.searchLessons(q, courseId);
  }

  @Get('reindex')
  async reindex() {
    await this.searchService.indexAll();
    return { ok: true, message: 'Reindex triggered' };
  }
}
