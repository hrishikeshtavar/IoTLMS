import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BrandingService {
  constructor(private prisma: PrismaService) {}

  async getBrandKitBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) return null;
    return this.prisma.brandKit.findUnique({ where: { tenant_id: tenant.id } });
  }

  async saveBrandKit(tenantId: string, data: {
    logo_url?: string;
    colors_json?: any;
    fonts_json?: any;
    favicon_url?: string;
    domain?: string;
  }) {
    return this.prisma.brandKit.upsert({
      where: { tenant_id: tenantId },
      update: data,
      create: { tenant_id: tenantId, ...data },
    });
  }
}
