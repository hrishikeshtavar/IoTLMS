import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LabSessionsService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: string, lessonId: string) {
    return this.prisma.labSession.create({
      data: {
        user_id: userId,
        lesson_id: lessonId,
        status: 'active',
      },
    });
  }

  async endSession(sessionId: string, status: 'completed' | 'abandoned') {
    return this.prisma.labSession.update({
      where: { id: sessionId },
      data: { status, ended_at: new Date() },
    });
  }

  async getSessionsByUser(userId: string) {
    return this.prisma.labSession.findMany({
      where: { user_id: userId },
      orderBy: { started_at: 'desc' },
    });
  }
}
