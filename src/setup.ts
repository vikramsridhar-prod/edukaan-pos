import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/** Market + language pages: /ae-en, /ae-ar, /sa-en, /sa-ar (and -hi / -ur). The page reads the slug itself. */
const SLUG = /^\/(ae|sa)-(en|ar|hi|ur)\/*$/i;

/** Settings shared by the real server (main.ts) and the end-to-end tests. */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  // Canonical slug URLs: lower case, no trailing slash (the page loads its files relative to the URL, so
  // /ae-en/ would look for /ae-en/app.js). Everything else is left to the static site and the API.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const m = SLUG.exec(req.path);
    if (!m) return next();
    const canonical = `/${m[1].toLowerCase()}-${m[2].toLowerCase()}`;
    if (req.path === canonical) return next();
    const query = req.originalUrl.slice(req.path.length);
    res.redirect(301, canonical + query);
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableShutdownHooks();
}
