import { Controller, Get, Post, Patch, Body, Param, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private svc: PaymentsService,
    private razorpay: RazorpayService,
  ) {}

  @Get()
  findAll(@Req() req: Request) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.findAll(tenantId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: { student: string; amount: number; method: string }) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.create(tenantId, dto);
  }

  @Post('razorpay/order')
  async createOrder(@Body() body: { amount: number; student: string }) {
    const receipt = `rcpt_${Date.now()}`;
    const order = await this.razorpay.createOrder(body.amount, 'INR', receipt);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
    };
  }

  @Post('razorpay/verify')
  async verifyPayment(
    @Req() req: Request,
    @Body() body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      student: string;
      amount: number;
    },
  ) {
    const isValid = this.razorpay.verifySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
    );

    if (!isValid) return { success: false, message: 'Invalid signature' };

    const tenantId = (req as any)['tenantId'] ?? 'default';
    const payment = await this.svc.create(tenantId, {
      student: body.student,
      amount: body.amount,
      method: 'Razorpay',
    });

    return { success: true, payment };
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.svc.updateStatus(id, body.status);
  }
}
