import { Controller, Get, Param, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@Req() req: Request) {
    const tenantId = (req as any).user?.tenantId ?? (req as any)['tenantId'] ?? null;
    if (!tenantId) return { totalStudents: 0, totalCourses: 0, totalEnrollments: 0, completionRate: 0, passRate: 0, enrollmentTrend: [], coursePerformance: [] };
    return this.svc.getDashboardStats(tenantId);
  }

  @Get('certificate/:courseId/:userId')
  getCertificateData(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    const tenantId = (req as any).user?.tenantId ?? (req as any)['tenantId'] ?? null;
    if (!tenantId) return { totalStudents: 0, totalCourses: 0, totalEnrollments: 0, completionRate: 0, passRate: 0, enrollmentTrend: [], coursePerformance: [] };
    return this.svc.getCertificateData(courseId, userId, tenantId);
  }
}
