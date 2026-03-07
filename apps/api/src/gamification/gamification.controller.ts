import { Controller, Get, Req } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private svc: GamificationService) {}

  @Get('stats')
  getStats(@Req() req: any) {
    return this.svc.getUserStats(req.user.id, req.tenantId);
  }
}
