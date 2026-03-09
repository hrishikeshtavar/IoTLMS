import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { WebhookController } from './webhook.controller';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from './razorpay.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [EnrollmentsModule],
  providers: [PaymentsService, PrismaService, RazorpayService],
  controllers: [PaymentsController, WebhookController],
})
export class PaymentsModule {}
