import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async recordActivity(userId: string, tenantId: string, activityType: string, entityId?: string) {
    await this.prisma.userActivity.create({
      data: { user_id: userId, tenant_id: tenantId, activity_type: activityType, entity_id: entityId },
    });
    await this.checkAndAwardBadges(userId, tenantId);
  }

  async getStreak(userId: string): Promise<number> {
    const activities = await this.prisma.userActivity.findMany({
      where: { user_id: userId },
      select: { created_at: true },
      orderBy: { created_at: 'desc' },
    });

    if (!activities.length) return 0;

    const days = [...new Set(activities.map(a =>
      new Date(a.created_at).toISOString().split('T')[0]
    ))].sort().reverse();

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (days[0] !== today && days[0] !== yesterday) return 0;

    for (let i = 0; i < days.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      if (days[i] === expected) streak++;
      else break;
    }
    return streak;
  }

  async getUserStats(userId: string, tenantId: string) {
    const [lessons, quizzes, labs, certs, courses, streak, badges] = await Promise.all([
      this.prisma.userActivity.count({ where: { user_id: userId, activity_type: 'lesson_complete' } }),
      this.prisma.submission.count({ where: { user_id: userId, passed: true } }),
      this.prisma.labSession.count({ where: { user_id: userId, status: 'completed' } }),
      this.prisma.certificate.count({ where: { user_id: userId } }),
      this.prisma.enrollment.count({ where: { user_id: userId } }),
      this.getStreak(userId),
      this.prisma.userBadge.findMany({
        where: { user_id: userId },
        include: { badge: true },
      }),
    ]);

    return { lessons, quizzes, labs, certs, courses, streak, badges };
  }

  async checkAndAwardBadges(userId: string, tenantId: string) {
    const stats = await this.getUserStats(userId, tenantId);
    const allBadges = await this.prisma.badge.findMany();
    const earned = new Set(stats.badges.map(b => b.badge.code));

    for (const badge of allBadges) {
      if (earned.has(badge.code)) continue;

      let qualifies = false;
      if (badge.threshold_type === 'lessons')  qualifies = stats.lessons >= badge.threshold_value;
      if (badge.threshold_type === 'quizzes')  qualifies = stats.quizzes >= badge.threshold_value;
      if (badge.threshold_type === 'labs')     qualifies = stats.labs >= badge.threshold_value;
      if (badge.threshold_type === 'certs')    qualifies = stats.certs >= badge.threshold_value;
      if (badge.threshold_type === 'courses')  qualifies = stats.courses >= badge.threshold_value;
      if (badge.threshold_type === 'streak')   qualifies = stats.streak >= badge.threshold_value;

      if (qualifies) {
        await this.prisma.userBadge.create({
          data: { user_id: userId, badge_id: badge.id },
        }).catch(() => {}); // ignore duplicate
      }
    }
  }
}
