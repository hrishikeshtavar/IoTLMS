import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, tenantId: string, data: {
    name?: string;
    phone?: string;
    language_pref?: string;
    class_grade?: number;
    division?: string;
  }) {
    return this.prisma.user.updateMany({
      where: { id, tenant_id: tenantId },
      data,
    });
  }

  async changePassword(id: string, tenantId: string, password: string) {
    const password_hash = await bcrypt.hash(password, 12);
    return this.prisma.user.updateMany({
      where: { id, tenant_id: tenantId },
      data: { password_hash },
    });
  }

  async deactivate(id: string, tenantId: string) {
    return this.prisma.user.updateMany({
      where: { id, tenant_id: tenantId },
      data: { is_active: false },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.prisma.user.deleteMany({ where: { id, tenant_id: tenantId } });
    return { ok: true };
  }

  async bulkImport(tenantId: string, rows: { name: string; email?: string; phone?: string; role?: string; language?: string; username?: string; class_grade?: number; division?: string; password?: string }[]) {
    const results = await Promise.allSettled(
      rows.map(async row => {
        const data: any = {
          tenant_id: tenantId,
          name: row.name,
          email: row.email,
          phone: row.phone,
          role: row.role ?? 'student',
          language_pref: row.language ?? 'en',
          username: row.username,
          class_grade: row.class_grade,
          division: row.division,
        };
        if (row.password) {
          const bcrypt = require('bcrypt');
          data.password_hash = await bcrypt.hash(row.password, 12);
        }
        return this.prisma.user.create({ data });
      })
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    return { imported: succeeded, failed, total: rows.length };
  }
}
