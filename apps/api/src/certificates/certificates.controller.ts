import { Controller, Post, Get, Param, Req, Query } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('certificates')
export class CertificatesController {
  constructor(private svc: CertificatesService) {}

  @Post('issue/:courseId')
  issue(@Param('courseId') courseId: string, @Req() req: any) {
    return this.svc.issue(req.user.id, courseId, req.tenantId);
  }

  @Public()
  @Get('verify/:certCode')
  verify(@Param('certCode') certCode: string) {
    return this.svc.verify(certCode);
  }

  @Get()
  findAll(@Req() req: any, @Query('tenantId') queryTenantId?: string) {
    const tenantId = (req.user?.role === 'super_admin' && queryTenantId)
      ? queryTenantId
      : req.tenantId;
    return this.svc.findAllForTenant(tenantId);
  }

  @Get('student/:userId')
  findForStudent(@Param('userId') userId: string, @Req() req: any) {
    return this.svc.findForStudent(userId, req.tenantId);
  }
}
