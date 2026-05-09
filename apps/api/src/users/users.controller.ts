import { Controller, Get, Post, Patch, Delete, Body, Param, Req, HttpCode, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@Roles('admin', 'super_admin')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get()
  findAll(@Req() req: Request, @Query('tenantId') queryTenantId?: string) {
    const user = (req as any)['user'];
    const reqTenantId = (req as any)['tenantId'] ?? 'default';
    const tenantId = (user?.role === 'super_admin' && queryTenantId) ? queryTenantId : reqTenantId;
    return this.svc.findAll(tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.update(id, tenantId, body);
  }

  @Patch(':id/password')
  changePassword(@Param('id') id: string, @Body('password') password: string, @Req() req: Request) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.changePassword(id, tenantId, password);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string, @Req() req: Request) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.deactivate(id, tenantId);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string, @Req() req: Request) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.remove(id, tenantId);
  }

  @Post('bulk-import')
  bulkImport(@Req() req: Request, @Body() body: { tenantId?: string; rows: { name: string; email?: string; role?: string; language?: string }[] }) {
    const user = (req as any)['user'];
    const reqTenantId = (req as any)['tenantId'] ?? 'default';
    const tenantId = (user?.role === 'super_admin' && body.tenantId) ? body.tenantId : reqTenantId;
    return this.svc.bulkImport(tenantId, body.rows);
  }
}
