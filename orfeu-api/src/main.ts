import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as dns from 'node:dns';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const lastfmHost = new URL(
    process.env.LASTFM_BASE_URL ?? 'https://ws.audioscrobbler.com/2.0/',
  ).hostname;

  try {
    await dns.promises.resolve4(lastfmHost);
  } catch {
    logger.warn(
      `DNS resolution failed for ${lastfmHost}. Last.fm API calls will fail or require retries.`,
    );
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
  });

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application listening on port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
