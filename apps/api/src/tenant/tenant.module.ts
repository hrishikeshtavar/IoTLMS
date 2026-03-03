import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TenantService, PrismaService],
  exports: [TenantService, PrismaService],
})
export class TenantModule {}
