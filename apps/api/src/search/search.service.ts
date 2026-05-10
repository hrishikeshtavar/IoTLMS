import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private readonly host: string;
  private readonly key: string | undefined;

  constructor(private prisma: PrismaService) {
    this.host = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
    this.key  = process.env.MEILISEARCH_KEY;
  }

  private headers() {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.key) h['Authorization'] = `Bearer ${this.key}`;
    return h;
  }

  private async meili(method: string, path: string, body?: any) {
    const res = await fetch(`${this.host}${path}`, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.ok ? res.json() : null;
  }

  async onModuleInit() {
    await this.setupIndexes();
    await this.indexAll();
  }

  private async setupIndexes() {
    try {
      await this.meili('PATCH', '/indexes/courses/settings', {
        searchableAttributes: ['title_en', 'title_hi', 'title_mr', 'description_en', 'category', 'tags'],
        filterableAttributes: ['tenant_id', 'status', 'category', 'level'],
        sortableAttributes: ['created_at'],
      });
      await this.meili('PATCH', '/indexes/lessons/settings', {
        searchableAttributes: ['title', 'title_hi', 'title_mr', 'description'],
        filterableAttributes: ['course_id', 'type'],
        sortableAttributes: ['order_index'],
      });
      this.logger.log('Meilisearch indexes configured');
    } catch (e) {
      this.logger.error('Failed to configure indexes', e);
    }
  }

  async indexAll() {
    try {
      const [courses, lessons] = await Promise.all([
        this.prisma.course.findMany({
          where: { status: 'published' },
          select: {
            id: true, title_en: true, title_hi: true, title_mr: true,
            description_en: true, category: true, level: true,
            thumbnail_url: true, tenant_id: true, status: true,
            slug: true, tags_json: true, created_at: true,
          },
        }),
        this.prisma.lesson.findMany({
          select: {
            id: true, title: true, title_hi: true, title_mr: true,
            description: true, type: true, course_id: true, order_index: true,
          },
        }),
      ]);

      const courseDocs = courses.map(c => ({
        ...c,
        tags: Array.isArray(c.tags_json) ? (c.tags_json as string[]).join(' ') : '',
        created_at: c.created_at.toISOString(),
      }));

      await this.meili('POST', '/indexes/courses/documents?primaryKey=id', courseDocs);
      await this.meili('POST', '/indexes/lessons/documents?primaryKey=id', lessons);
      this.logger.log(`Indexed ${courses.length} courses, ${lessons.length} lessons`);
    } catch (e) {
      this.logger.error('Indexing failed', e);
    }
  }

  async searchCourses(query: string, tenantId?: string, filters?: { category?: string; level?: string }) {
    const filterParts: string[] = ['status = "published"'];
    if (tenantId) filterParts.push(`tenant_id = "${tenantId}"`);
    if (filters?.category) filterParts.push(`category = "${filters.category}"`);
    if (filters?.level) filterParts.push(`level = "${filters.level}"`);

    return this.meili('POST', '/indexes/courses/search', {
      q: query,
      filter: filterParts.join(' AND '),
      limit: 20,
      attributesToHighlight: ['title_en', 'description_en'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });
  }

  async searchLessons(query: string, courseId?: string) {
    const filter = courseId ? `course_id = "${courseId}"` : undefined;
    return this.meili('POST', '/indexes/lessons/search', { q: query, filter, limit: 20 });
  }

  async searchAll(query: string, tenantId?: string) {
    const [courses, lessons] = await Promise.all([
      this.searchCourses(query, tenantId),
      this.searchLessons(query),
    ]);
    return {
      courses: (courses as any)?.hits ?? [],
      lessons: (lessons as any)?.hits ?? [],
      total: ((courses as any)?.estimatedTotalHits ?? 0) + ((lessons as any)?.estimatedTotalHits ?? 0),
    };
  }

  async indexCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== 'published') {
      await this.meili('DELETE', `/indexes/courses/documents/${courseId}`);
      return;
    }
    await this.meili('POST', '/indexes/courses/documents?primaryKey=id', [{
      ...course,
      tags: Array.isArray(course.tags_json) ? (course.tags_json as string[]).join(' ') : '',
      created_at: course.created_at.toISOString(),
    }]);
  }

  async indexLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (lesson) await this.meili('POST', '/indexes/lessons/documents?primaryKey=id', [lesson]);
  }
}
