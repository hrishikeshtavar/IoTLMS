import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto';

function genCode(len = 8): string {
  return randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64url')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, len);
}

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async issue(userId: string, courseId: string, tenantId: string) {
    // Check enrollment is 100% complete
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { user_id: userId, course_id: courseId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.progress_pct < 100)
      throw new ForbiddenException('Course not yet completed');

    // Idempotent — return existing cert if already issued
    const existing = await this.prisma.certificate.findFirst({
      where: { user_id: userId, course_id: courseId },
    });
    if (existing) return existing;

    // Calculate score from submissions
    const submissions = await this.prisma.submission.findMany({
      where: { user_id: userId, assessment: { lesson: { course_id: courseId } } },
    });
    const totalScore = submissions.reduce((s, sub) => s + sub.score, 0);
    const maxScore = submissions.length * 100;
    const score_pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;

    // Generate cert code: IOTL-{tenantSlug}-{random8}
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const slug = tenant?.slug?.toUpperCase() ?? 'IOTL';
    const cert_code = `IOTL-${slug}-${genCode(8)}`;

    return this.prisma.certificate.create({
      data: { user_id: userId, course_id: courseId, tenant_id: tenantId, cert_code, score_pct },
    });
  }

  async verify(certCode: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { cert_code: certCode },
    });
    if (!cert) throw new NotFoundException('Certificate not found');

    const [user, course, tenant] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: cert.user_id } }),
      this.prisma.course.findUnique({ where: { id: cert.course_id } }),
      this.prisma.tenant.findUnique({ where: { id: cert.tenant_id } }),
    ]);

    return {
      valid: true,
      certCode: cert.cert_code,
      studentName: user?.name,
      courseName: course?.title_en,
      school: tenant?.name,
      score: `${cert.score_pct}%`,
      issuedAt: cert.issued_at,
    };
  }
}
