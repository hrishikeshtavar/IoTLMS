import { Module } from '@nestjs/common';
import { LessonContentService } from './lesson-content.service';
import { LessonContentController } from './lesson-content.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LessonContentController],
  providers: [LessonContentService, PrismaService],
  exports: [LessonContentService],
})
export class LessonContentModule {}
