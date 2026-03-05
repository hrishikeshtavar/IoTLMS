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

  @Post()
  @Roles('school_admin', 'super_admin')
  async saveBrandKit(@Req() req: any, @Body() body: any) {
    return this.brandingService.saveBrandKit(req.tenantId, body);
  }
}
