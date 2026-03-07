import { Module } from '@nestjs/common';
import { GamificationModule } from '../gamification/gamification.module';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [GamificationModule],
  controllers: [LessonsController],
  providers: [LessonsService, PrismaService],
})
export class LessonsModule {}
