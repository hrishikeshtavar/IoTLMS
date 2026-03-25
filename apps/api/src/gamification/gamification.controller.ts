import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private svc: GamificationService) {}

  @Get('stats')
  getStats(@Req() req: any) {
    return this.svc.getUserStats(req.user.id, req.tenantId);
  }

  @Post('activity')
  recordActivity(@Req() req: any, @Body() body: { activityType: string; entityId?: string }) {
    return this.svc.recordActivity(req.user.id, req.tenantId, body.activityType, body.entityId);
  }
}
