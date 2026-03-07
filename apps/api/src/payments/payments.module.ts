import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from './razorpay.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [EnrollmentsModule],
  providers: [PaymentsService, RazorpayService, PrismaService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
