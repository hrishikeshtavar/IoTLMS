import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);
  private logger = new Logger(EmailService.name);
  private from = process.env.FROM_EMAIL || 'noreply@iotlearn.in';

  async sendVerification(to: string, name: string, token: string, tenantSlug: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;
    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'Verify your IoTLearn account',
        html: `<h2>Welcome, ${name}!</h2>
               <p>Click below to verify your email address:</p>
               <a href="${url}" style="background:#1A73E8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">
                 Verify Email
               </a>
               <p>This link expires in 24 hours.</p>
               <p>If you did not create an account, ignore this email.</p>`,
      });
      this.logger.log('Verification email sent to ' + to);
    } catch (err) {
      this.logger.error('Failed to send verification email', err);
    }
  }

  async sendPasswordReset(to: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;
    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'Reset your IoTLearn password',
        html: `<h2>Password Reset</h2>
               <p>Click below to reset your password. This link expires in 1 hour.</p>
               <a href="${url}" style="background:#FF6B35;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">
                 Reset Password
               </a>
               <p>If you did not request this, ignore this email.</p>`,
      });
      this.logger.log('Password reset email sent to ' + to);
    } catch (err) {
      this.logger.error('Failed to send password reset email', err);
    }
  }
}
