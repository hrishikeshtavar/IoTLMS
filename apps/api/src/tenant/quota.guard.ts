import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const tenantId = req.tenantId;
    if (!tenantId) return true;

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant?.plan_id) return true;

    const plans = await this.prisma.$queryRaw`SELECT * FROM "Plan" WHERE id = ${tenant.plan_id} LIMIT 1` as any[];
    const plan = plans[0];
    if (!plan) return true;

    const path: string = req.path || '';

    // Check course limit on POST /api/courses
    if (req.method === 'POST' && path.endsWith('/courses')) {
      const count = await this.prisma.course.count({ where: { tenant_id: tenantId } });
      if (count >= plan.max_courses) {
        throw new HttpException(`Plan limit reached: max ${plan.max_courses} courses. Upgrade your plan.`, HttpStatus.PAYMENT_REQUIRED);
      }
    }

    // Check student limit on POST /api/enrollments
    if (req.method === 'POST' && path.endsWith('/enrollments')) {
      const count = await this.prisma.enrollment.count({
        where: { course: { tenant_id: tenantId } },
      });
      if (count >= plan.max_students) {
        throw new HttpException(`Plan limit reached: max ${plan.max_students} students. Upgrade your plan.`, HttpStatus.PAYMENT_REQUIRED);
      }
    }

    return true;
  }
}
