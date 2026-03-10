import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: { student: string; amount: number; method: string }) {
    const count = await this.prisma.payment.count({ where: { tenant_id: tenantId } });
    return this.prisma.payment.create({
      data: {
        tenant_id: tenantId,
        student: dto.student,
        amount: dto.amount,
        method: dto.method,
        status: 'paid',
        receipt_no: `RCP${String(count + 1).padStart(4, '0')}`,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.payment.findMany({
      where: tenantId ? { tenant_id: tenantId } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.payment.update({ where: { id }, data: { status } });
  }
}
