import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto, tenantId: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, tenant_id: tenantId },
    });
    if (existing) throw new ConflictException('Email already registered');

    const password_hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        tenant_id: tenantId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        language_pref: dto.language_pref || 'en',
        password_hash,
      },
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.user.update({ where: { id: user.id }, data: { email_verify_token: verifyToken } }).catch(() => {});
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (dto.email) {
      this.emailService.sendVerification(dto.email, dto.name, verifyToken, tenant?.slug || 'demo');
    }
    return this.signTokens(user.id, user.email!, user.role, user.tenant_id, user.name);
  }

  async login(dto: LoginDto, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, tenant_id: tenantId },
    });
    if (!user || !user.password_hash)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    return this.signTokens(user.id, user.email!, user.role, user.tenant_id, user.name);
  }

  async refresh(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const stored = await this.prisma.refreshToken.findFirst({
      where: { token_hash: tokenHash, revoked: false },
      include: { user: true },
    });

    if (!stored || stored.expires_at < new Date())
      throw new UnauthorizedException('Invalid or expired refresh token');

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    return this.signTokens(
      stored.user.id,
      stored.user.email!,
      stored.user.role,
      stored.user.tenant_id,
      stored.user.name,
    );
  }

  private async signTokens(userId: string, email: string, role: string, tenantId: string, name?: string) {
    const payload = { sub: userId, email, role, tenantId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'dev_secret_change_me',
      expiresIn: '15m',
    });

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken, user: { id: userId, email, role, tenantId, name } };
  }
}
