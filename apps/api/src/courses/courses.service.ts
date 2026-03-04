import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, locale: string = 'en') {
    const courses = await this.prisma.course.findMany({
      where: { tenant_id: tenantId },
      include: { lessons: true },
      orderBy: { created_at: 'desc' },
    });
    return courses.map(course => ({
      ...course,
      title: course[`title_${locale}`] ?? course.title_en,
    }));
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.course.findFirst({
      where: { id, tenant_id: tenantId },
      include: { lessons: true },
    });
  }

  async create(tenantId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        ...dto,
        tenant_id: tenantId,
        status: 'draft',
      },
    });
  }

  async update(id: string, tenantId: string, dto: Partial<CreateCourseDto>) {
    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
