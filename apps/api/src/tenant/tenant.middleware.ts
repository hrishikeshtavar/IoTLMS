import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname;
    const slug = host.split('.')[0];

    const isBypassHost =
      slug === 'localhost' || slug === '127' || /^\d+$/.test(slug) ||
      slug === 'demo' || slug === 'api' || host.includes('trycloudflare.com') ||
      host.includes('vercel.app') || req.path === '/api/health';

    if (!isBypassHost) {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
      if (!tenant || !tenant.is_active) throw new NotFoundException('School not found or inactive');
      req['tenant'] = tenant;
      req['tenantId'] = tenant.id;
      return next();
    }

    // Single-domain: check explicit tenant header first
    const tenantIdHeader = req.headers['x-tenant-id'] as string | undefined;
    if (tenantIdHeader) {
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantIdHeader } });
      if (tenant && tenant.is_active) {
        req['tenant'] = tenant;
        req['tenantId'] = tenant.id;
        return next();
      }
    }

    // Dev fallback
    const devSlug = process.env.DEV_TENANT_SLUG ?? 'greenfield';
    const devTenant =
      (await this.prisma.tenant.findUnique({ where: { slug: devSlug } })) ??
      (await this.prisma.tenant.findFirst({ where: { is_active: true } }));
    req['tenantId'] = devTenant?.id ?? null;
    req['tenant'] = devTenant ?? null;
    return next();
  }
}
