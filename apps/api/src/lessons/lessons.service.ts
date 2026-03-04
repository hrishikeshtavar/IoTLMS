import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { course_id: courseId },
      orderBy: { order_index: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        course_id: dto.course_id,
        title: dto.title,
        type: dto.type ?? 'text',
        order_index: dto.order_index ?? 0,
        content_url: dto.content_url,
      },
    });
  }
}
