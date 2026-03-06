import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@Injectable()
export class RazorpayService {
  private razorpay: any;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'placeholder_secret',
    });
  }

  async createOrder(amount: number, currency = 'INR', receipt: string) {
    return this.razorpay.orders.create({
      amount: amount * 100, // paise
      currency,
      receipt,
    });
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const body = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? 'placeholder_secret')
      .update(body)
      .digest('hex');
    return expected === signature;
  }
}
