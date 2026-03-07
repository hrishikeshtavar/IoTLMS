import { Controller, Post, Get, Param, Req } from '@nestjs/common';
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
}
