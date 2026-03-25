import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.course.findMany({
      where: tenantId ? { tenant_id: tenantId } : undefined,
      orderBy: { created_at: 'desc' },
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
      data: { status },
    });
  }
}
