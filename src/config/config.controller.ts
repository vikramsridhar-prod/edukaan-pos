import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';

/** Public settings the landing page reads at runtime, so staging and production can differ without a rebuild. */
@SkipThrottle()
@Controller('config')
export class ConfigController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  get() {
    return { recaptchaSiteKey: this.config.get<string>('RECAPTCHA_SITE_KEY') || null };
  }
}
