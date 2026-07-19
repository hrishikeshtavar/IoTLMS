// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { initSentry } from './sentry';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  initSentry();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Security headers
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/upload/assets/')) {
      return helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })(req, res, next);
    }
    return helmet()(req, res, next);
  });

  // Input validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));

  // CORS from env
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const ok = allowedOrigins.some(o =>
        o.trim() === origin || (o.includes('*') && new RegExp(o.replace('*', '.*')).test(origin))
      );
      return ok ? callback(null, true) : callback(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log(`API running on http://localhost:${process.env.PORT || 3001}`);
}
bootstrap();