import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'node:path';
import { ConfigController } from './config/config.controller';
import { HealthController } from './health/health.controller';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // The landing page itself: a static site in public/ (see README). /api/* is left to the controllers.
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/{*path}'],
      serveStaticOptions: { maxAge: '1h' },
    }),
    // Public form endpoint: at most RATE_LIMIT (default 10) requests a minute per client.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{ ttl: 60_000, limit: Number(config.get('RATE_LIMIT')) || 10 }],
    }),
    LeadsModule,
  ],
  controllers: [HealthController, ConfigController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
