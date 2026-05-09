import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { BrandingService } from './branding.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get(':slug')
  @Public()
  async getBrandKit(@Param('slug') slug: string) {
    return this.brandingService.getBrandKitBySlug(slug);
  }

  @Get('tenant/:tenantId')
  @Roles('admin', 'super_admin')
  async getBrandKitByTenant(@Param('tenantId') tenantId: string) {
    return this.brandingService.getBrandKitByTenantId(tenantId);
  }

  @Post()
  @Roles('admin', 'super_admin')
  async saveBrandKit(@Req() req: any, @Body() body: any) {
    const { tenantId: bodyTenantId, ...data } = body;
    const tenantId = (req.user?.role === 'super_admin' && bodyTenantId)
      ? bodyTenantId
      : req.tenantId;
    return this.brandingService.saveBrandKit(tenantId, data);
  }
}
