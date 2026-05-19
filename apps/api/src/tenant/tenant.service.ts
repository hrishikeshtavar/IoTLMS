import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  async findAll() {
    const tenants = await this.prisma.tenant.findMany({ orderBy: { created_at: 'desc' } });
    return Promise.all(tenants.map(async t => {
      const [students, courses, certs] = await Promise.all([
        this.prisma.user.count({ where: { tenant_id: t.id, role: 'student' } }),
        this.prisma.course.count({ where: { tenant_id: t.id } }),
        this.prisma.certificate.count({ where: { tenant_id: t.id } }),
      ]);
      return { ...t, _count: { students, courses, certs } };
    }));
  }

  async getAggregateStats() {
    const [tenants, students, courses, certs] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.user.count({ where: { role: 'student' } }),
      this.prisma.course.count(),
      this.prisma.certificate.count(),
    ]);
    return { tenants, students, courses, certs };
  }

  async create(dto: { name: string; slug: string }) {
    const existing = await this.prisma.tenant.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('School slug already taken');
    return this.prisma.tenant.create({
      data: { name: dto.name, slug: dto.slug, is_active: true },
    });
  }

  async update(id: string, dto: { name?: string; is_active?: boolean }) {
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    // Get all course IDs for this tenant first
    const courses = await this.prisma.course.findMany({ where: { tenant_id: id }, select: { id: true } });
    const courseIds = courses.map(c => c.id);
    // Get all lesson IDs for cascade
    const lessons = await this.prisma.lesson.findMany({ where: { course_id: { in: courseIds } }, select: { id: true } });
    const lessonIds = lessons.map(l => l.id);
    // Cascade delete in correct order
    await this.prisma.submission.deleteMany({ where: { assessment: { lesson_id: { in: lessonIds } } } });
    await this.prisma.assessment.deleteMany({ where: { lesson_id: { in: lessonIds } } });
    await this.prisma.lessonContent.deleteMany({ where: { lesson_id: { in: lessonIds } } });
    await this.prisma.labSession.deleteMany({ where: { lesson_id: { in: lessonIds } } });
    await this.prisma.lesson.deleteMany({ where: { course_id: { in: courseIds } } });
    await this.prisma.enrollment.deleteMany({ where: { course_id: { in: courseIds } } });
    await this.prisma.certificate.deleteMany({ where: { tenant_id: id } });
    await this.prisma.course.deleteMany({ where: { tenant_id: id } });
    await this.prisma.userActivity.deleteMany({ where: { user: { tenant_id: id } } });
    await this.prisma.userBadge.deleteMany({ where: { user: { tenant_id: id } } });
    await this.prisma.refreshToken.deleteMany({ where: { user: { tenant_id: id } } });
    await this.prisma.user.deleteMany({ where: { tenant_id: id } });
    await this.prisma.brandKit.deleteMany({ where: { tenant_id: id } });
    return this.prisma.tenant.delete({ where: { id } });
  }
}
