import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

const SAFE_USER_SELECT = {
  id: true,
  tenant_id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  username: true,
  language_pref: true,
  class_grade: true,
  division: true,
  is_active: true,
  email_verified: true,
  last_login: true,
  last_active: true,
  created_at: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenant_id: tenantId },
      select: SAFE_USER_SELECT,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, tenantId: string, data: {
    name?: string;
    username?: string;
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

  async getSuperAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'super_admin' },
      orderBy: { created_at: 'asc' },
      select: { id: true, name: true, email: true, username: true, is_active: true, created_at: true, last_login: true },
    });
  }

  async updateAny(id: string, data: any) {
    const { password, ...rest } = data;
    const updateData: any = { ...rest };
    if (password) updateData.password_hash = await bcrypt.hash(password, 12);
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async removeAny(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }

  async bulkImport(tenantId: string | null | undefined, rows: { name: string; email?: string; phone?: string; role?: string; language?: string; username?: string; class_grade?: number; division?: string; password?: string }[]) {
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
        const pwd = row.password || 'Student@1234';
        data.password_hash = await bcrypt.hash(pwd, 12);
        return this.prisma.user.create({ data });
      })
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    return { imported: succeeded, failed, total: rows.length };
  }
}
