import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Settings shared by the real server (main.ts) and the end-to-end tests. */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableShutdownHooks();
}
