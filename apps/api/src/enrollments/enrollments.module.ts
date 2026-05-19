import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../auth/email.service';

@Module({
  controllers: [EnrollmentsController],
  exports: [EnrollmentsService],
  providers: [EnrollmentsService, PrismaService, EmailService],
})
export class EnrollmentsModule {}
