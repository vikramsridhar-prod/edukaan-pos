import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/setup';

describe('Edukaan POS (e2e)', () => {
  let app: INestApplication;
  let dir: string;
  const leadsFile = () => join(dir, 'leads.jsonl');

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), 'edukaan-'));
    process.env.LEADS_FILE = leadsFile();
    process.env.LEADS_TOKEN = 'test-token';
    // Boot exactly like main.ts. (Test.createTestingModule would build ServeStaticModule before the
    // HTTP adapter exists, so the landing page would not be served in tests.)
    app = await NestFactory.create(AppModule, { logger: false });
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it('serves the landing page and its scripts', async () => {
    const page = await request(app.getHttpServer()).get('/').expect(200);
    expect(page.text).toContain('<div id="app"></div>');
    await request(app.getHttpServer()).get('/template.js').expect(200);
    await request(app.getHttpServer()).get('/assets/flag-ae.svg').expect(200);
  });

  it('reports health', () => request(app.getHttpServer()).get('/api/health').expect(200, { status: 'ok' }));

  it('returns 404 JSON for unknown API routes instead of the page', async () => {
    const res = await request(app.getHttpServer()).get('/api/nope').expect(404);
    expect(res.body.statusCode).toBe(404);
  });

  it('stores a valid call-back request', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/leads')
      .send({ name: '  Amal  ', phone: '+971 50 123 4567', storeType: 'Baqala', market: 'AE', lang: 'en' })
      .expect(201);
    expect(res.body.id).toEqual(expect.any(String));
    const saved = JSON.parse(readFileSync(leadsFile(), 'utf8').trim().split('\n').pop()!);
    expect(saved).toMatchObject({ id: res.body.id, name: 'Amal', phone: '+971 50 123 4567', market: 'AE' });
  });

  it.each([
    ['a missing name', { phone: '+971501234567', market: 'AE' }],
    ['a bad phone number', { name: 'Amal', phone: 'call me', market: 'AE' }],
    ['an unknown market', { name: 'Amal', phone: '+971501234567', market: 'US' }],
    ['unexpected fields', { name: 'Amal', phone: '+971501234567', market: 'AE', admin: true }],
  ])('rejects %s', (_label, body) => request(app.getHttpServer()).post('/api/leads').send(body).expect(400));

  it('lists leads only with the token', async () => {
    await request(app.getHttpServer()).get('/api/leads').expect(401);
    await request(app.getHttpServer()).get('/api/leads').set('Authorization', 'Bearer wrong').expect(401);
    const res = await request(app.getHttpServer()).get('/api/leads').set('Authorization', 'Bearer test-token').expect(200);
    expect(res.body[0]).toMatchObject({ name: 'Amal' });
  });
});
