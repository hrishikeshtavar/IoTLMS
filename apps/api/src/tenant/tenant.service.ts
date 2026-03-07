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

  async create(dto: { name: string; slug: string; plan_id?: string }) {
    const existing = await this.prisma.tenant.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('School slug already taken');
    return this.prisma.tenant.create({
      data: { name: dto.name, slug: dto.slug, plan_id: dto.plan_id ?? 'free', is_active: true },
    });
  }

  async update(id: string, dto: { name?: string; is_active?: boolean; plan_id?: string }) {
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }
}
