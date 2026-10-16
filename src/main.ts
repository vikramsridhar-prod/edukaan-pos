import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app);
  const config = app.get(ConfigService);
  // Behind a load balancer or reverse proxy, set TRUST_PROXY=1 so rate limiting sees the real client IP.
  if (config.get('TRUST_PROXY')) app.set('trust proxy', Number(config.get('TRUST_PROXY')) || true);
  const port = Number(config.get('PORT') ?? 3000);
  await app.listen(port);
  console.log(`Edukaan POS running on http://localhost:${port}`);
}
bootstrap();
