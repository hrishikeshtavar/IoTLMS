import { Controller, Post, Get, Patch, Body, Param, Req, HttpCode, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  enroll(@Body() dto: CreateEnrollmentDto, @Req() req: Request) {
    const userId   = (req as any).user?.id ?? '';
    const tenantId = (req as any).user?.tenantId ?? (req as any)['tenantId'] ?? '';
    return this.enrollmentsService.enroll({ ...dto, user_id: userId, tenant_id: tenantId });
  }

  @Get('user/:userId')
  getEnrollments(@Param('userId') userId: string) {
    return this.enrollmentsService.getEnrollments(userId);
  }

  @Get('tenant/all')
  getAllByTenant(@Req() req: Request) {
    const tenantId = (req as any).user?.tenantId ?? (req as any)['tenantId'] ?? '';
    return this.enrollmentsService.getAllByTenant(tenantId);
  }

  @Patch(':courseId/progress')
  updateProgress(
    @Param('courseId') courseId: string,
    @Body() body: { user_id: string; progress_pct: number },
    @Req() req: Request,
  ) {
    const caller = (req as any).user;
    const tenantId = caller?.tenantId ?? (req as any)['tenantId'] ?? '';
    // Identity comes from the token. Only admins may write progress for another user.
    const isAdmin = caller?.role === 'admin' || caller?.role === 'super_admin';
    const targetUserId = (isAdmin && body.user_id) ? body.user_id : caller?.id;
    if (!targetUserId) throw new ForbiddenException('No authenticated user');
    return this.enrollmentsService.updateProgress(targetUserId, courseId, body.progress_pct, tenantId);
  }

  @Post('remind-unenrolled')
  @HttpCode(200)
  remindUnenrolled(@Req() req: Request) {
    const tenantId = (req as any).user?.tenantId ?? (req as any)['tenantId'] ?? '';
    return this.enrollmentsService.sendEnrollmentReminders(tenantId);
  }
}
