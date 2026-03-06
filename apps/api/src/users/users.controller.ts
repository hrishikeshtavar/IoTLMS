import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get()
  findAll(@Req() req: Request) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.findAll(tenantId);
  }

  @Post('bulk-import')
  bulkImport(
    @Req() req: Request,
    @Body() body: { rows: { name: string; email?: string; role?: string; language?: string }[] },
  ) {
    const tenantId = (req as any)['tenantId'] ?? 'default';
    return this.svc.bulkImport(tenantId, body.rows);
  }
}
