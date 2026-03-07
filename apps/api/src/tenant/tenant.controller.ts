import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('tenants')
export class TenantController {
  constructor(private svc: TenantService) {}

  @Roles('super_admin')
  @Get()
  findAll() { return this.svc.findAll(); }

  @Roles('super_admin')
  @Get('stats')
  getStats() { return this.svc.getAggregateStats(); }

  @Public()
  @Post()
  create(@Body() dto: { name: string; slug: string; plan_id?: string }) {
    return this.svc.create(dto);
  }

  @Roles('super_admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }
}
