import { Module } from '@nestjs/common';
import { LabSessionsService } from './lab-sessions.service';
import { LabSessionsController } from './lab-sessions.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LabSessionsController],
  providers: [LabSessionsService, PrismaService],
  exports: [LabSessionsService],
})
export class LabSessionsModule {}
