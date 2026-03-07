import { Controller, Post, Get, Body, Req, HttpCode, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import * as crypto from 'crypto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private razorpayService: RazorpayService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @Post('razorpay/order')
  async createOrder(@Body() body: { amount: number; courseId: string }, @Req() req: any) {
    const receipt = `rcpt_${Date.now()}`;
    const order = await this.razorpayService.createOrder(body.amount, 'INR', receipt);
    return { orderId: order.id, amount: order.amount, currency: order.currency };
  }

  @Post('razorpay/verify')
  @HttpCode(200)
  async verify(
    @Body() body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; courseId: string; userId: string; amount: number },
    @Req() req: any,
  ) {
    const valid = this.razorpayService.verifySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
    );
    if (!valid) throw new BadRequestException('Invalid payment signature');

    // Record payment
    await this.paymentsService.create(req.tenantId, {
      student: body.userId,
      amount: body.amount,
      method: 'Razorpay',
    });

    // Unlock enrollment
    await this.enrollmentsService.enroll({
      user_id: body.userId,
      course_id: body.courseId,
    });

    return { ok: true, message: 'Payment verified and enrollment unlocked' };
  }

  @Public()
  @Post('razorpay/webhook')
  @HttpCode(200)
  async webhook(@Body() body: any, @Req() req: any) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
    const signature = req.headers['x-razorpay-signature'];
    const digest = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');

    if (digest !== signature) throw new BadRequestException('Invalid webhook signature');

    if (body.event === 'payment.failed') {
      console.log('Payment failed:', body.payload?.payment?.entity?.id);
    }
    return { ok: true };
  }

  @Roles('school_admin', 'super_admin')
  @Get()
  findAll(@Req() req: any) {
    return this.paymentsService.findAll(req.tenantId);
  }
}
