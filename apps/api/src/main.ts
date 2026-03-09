// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Security headers
  app.use(helmet());

  // Input validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

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
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
  console.log(`API running on http://localhost:${process.env.PORT || 3001}`);
}
bootstrap();