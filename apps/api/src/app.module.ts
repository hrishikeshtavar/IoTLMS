import { UploadModule } from './upload/upload.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { BrandingModule } from './branding/branding.module';
import { LessonContentModule } from './lesson-content/lesson-content.module';
import { LabSessionsModule } from './lab-sessions/lab-sessions.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AnalyticsModule } from './analytics/analytics.module';
import { SubtitlesModule } from './subtitles/subtitles.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    UploadModule,  
    TenantModule,
    CoursesModule,
    EnrollmentsModule,
    LessonsModule,
    AssessmentsModule,
    
    BrandingModule,
    LessonContentModule,
    LabSessionsModule,
    AnalyticsModule,
    SubtitlesModule,
    PaymentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
