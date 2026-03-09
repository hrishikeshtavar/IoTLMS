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
      const devTenant = await this.prisma.tenant.findUnique({ where: { slug: 'localhost' } });
      if (devTenant) {
        req['tenantId'] = devTenant.id;
        req['tenant'] = devTenant;
      } else {
        req['tenantId'] = null;
        req['tenant'] = null;
      }
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
