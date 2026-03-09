import { Controller, Post, Headers, Body, BadRequestException, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('payments/razorpay')
export class WebhookController {
  private logger = new Logger(WebhookController.name);

  constructor(private prisma: PrismaService) {}

  @Public()
  @Post('webhook')
  async handle(
    @Headers('x-razorpay-signature') sig: string,
    @Body() body: any,
  ) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (secret) {
      const expected = createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex');
      try {
        const match = timingSafeEqual(
          Buffer.from(sig || ''),
          Buffer.from(expected),
        );
        if (!match) throw new BadRequestException('Invalid signature');
      } catch {
        throw new BadRequestException('Invalid signature');
      }
    }

    const event = body?.event;
    const payment = body?.payload?.payment?.entity;

    this.logger.log('Webhook received: ' + event);

    if (event === 'payment.captured' && payment) {
      const notes = payment.notes || {};

      await this.prisma.payment.updateMany({
        where: { receipt_no: payment.id },
        data: { status: 'paid' },
      });

      if (notes.courseId && notes.userId && notes.tenantId) {
        const existing = await this.prisma.enrollment.findFirst({
          where: { user_id: notes.userId, course_id: notes.courseId },
        });
        if (!existing) {
          await this.prisma.enrollment.create({
            data: {
              user_id: notes.userId,
              course_id: notes.courseId,
              progress_pct: 0,
            },
          });
          this.logger.log('Enrolled user ' + notes.userId + ' in course ' + notes.courseId);
        }
      }
    }

    if (event === 'payment.failed' && payment) {
      await this.prisma.payment.updateMany({
        where: { receipt_no: payment.id },
        data: { status: 'failed' },
      });
      this.logger.log('Payment failed: ' + payment.id);
    }

    return { received: true };
  }
}
