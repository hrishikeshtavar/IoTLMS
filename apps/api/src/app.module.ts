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

@Module({
  imports: [UploadModule,  
    TenantModule,
    CoursesModule,
    EnrollmentsModule,
    LessonsModule,
    AssessmentsModule,
    
    BrandingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
