import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async bulkImport(tenantId: string, rows: { name: string; email?: string; role?: string; language?: string }[]) {
    const results = await Promise.allSettled(
      rows.map(row =>
        this.prisma.user.create({
          data: {
            tenant_id: tenantId,
            name: row.name,
            email: row.email,
            role: row.role ?? 'student',
            language_pref: row.language ?? 'en',
          },
        })
      )
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    return { imported: succeeded, failed, total: rows.length };
  }

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
    });
  }
}
