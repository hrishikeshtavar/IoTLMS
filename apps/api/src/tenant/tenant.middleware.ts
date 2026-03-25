import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname;
    const slug = host.split('.')[0];

    if (slug === 'localhost' || slug === '127' || slug === 'demo' || req.path === '/api/health') {
      // In dev, fall back to a named slug or the first active tenant
      const devSlug = process.env.DEV_TENANT_SLUG ?? 'greenfield';
      const devTenant =
        (await this.prisma.tenant.findUnique({ where: { slug: devSlug } })) ??
        (await this.prisma.tenant.findFirst({ where: { is_active: true } }));
      req['tenantId'] = devTenant?.id ?? null;
      req['tenant'] = devTenant ?? null;
      return next();
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || !tenant.is_active) {
      throw new NotFoundException('School not found or inactive');
    }

    req['tenant'] = tenant;
    req['tenantId'] = tenant.id;
    next();
  }
}
