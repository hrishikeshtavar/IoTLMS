import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, grade?: number) {
    // Return school's own courses + published courses from other tenants (global catalog)
    const gradeFilter = grade ? { OR: [{ target_grade: null }, { target_grade: String(grade) }] } : {};
    const where = tenantId ? {
      AND: [
        gradeFilter,
        { OR: [
          { tenant_id: tenantId },
          { status: 'published' as const, NOT: { tenant_id: tenantId } },
        ]},
      ],
    } : { AND: [gradeFilter, { status: 'published' as const }] };
    return this.prisma.course.findMany({
      where: grade ? where : (tenantId ? { OR: [{ tenant_id: tenantId }, { status: 'published' as const, NOT: { tenant_id: tenantId } }] } : { status: 'published' as const }),
      orderBy: [{ order_index: 'asc' }, { created_at: 'asc' }],
      include: {
        _count: { select: { enrollments: true, lessons: true } },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.course.findFirst({ where: { id, tenant_id: tenantId } });
  }

  async create(data: any, tenantId: string) {
    return this.prisma.course.create({
      data: { ...data, tenant_id: tenantId },
    });
  }

  async update(id: string, data: any, tenantId: string) {
    return this.prisma.course.updateMany({
      where: { id, tenant_id: tenantId },
      data,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.course.deleteMany({
      where: { id, tenant_id: tenantId },
    });
  }

  async updateStatus(id: string, status: string, tenantId: string) {
    return this.prisma.course.updateMany({
      where: { id, tenant_id: tenantId },
      data: { status: status as any },
    });
  }

  async reorderCourses(orders: { id: string; order_index: number }[]) {
    if (!orders?.length) return { success: true };
    await Promise.all(
      orders.map(({ id, order_index }) =>
        this.prisma.course.updateMany({ where: { id }, data: { order_index } }),
      ),
    );
    return { success: true };
  }
}
