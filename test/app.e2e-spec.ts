import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer, IncomingHttpHeaders, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/setup';

describe('Edukaan POS (e2e)', () => {
  let app: INestApplication;
  let dir: string;
  let crm: Server;
  const crmCalls: { headers: IncomingHttpHeaders; body: any }[] = [];
  const leadsFile = () => join(dir, 'leads.jsonl');

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), 'edukaan-'));
    // A stand-in for the CRM leads API that records what it receives.
    crm = createServer((req, res) => {
      let data = '';
      req.on('data', c => (data += c));
      req.on('end', () => { crmCalls.push({ headers: req.headers, body: JSON.parse(data) }); res.writeHead(201).end('{}'); });
    });
    await new Promise<void>(r => crm.listen(0, '127.0.0.1', r));
    process.env.CRM_LEADS_URL = `http://127.0.0.1:${(crm.address() as AddressInfo).port}/api/www/v1/leads`;
    process.env.CRM_API_KEY = 'test-crm-key';
    process.env.RECAPTCHA_SITE_KEY = 'test-site-key';
    process.env.RATE_LIMIT = '100';
    process.env.CRM_FORM_TYPE = 'POS';
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
    await new Promise(r => crm.close(r));
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

  it('stores a valid call-back request and sends it to the CRM with the reCAPTCHA token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/leads')
      .set('g-recaptcha-response', 'test-recaptcha-token')
      .send({ name: '  Amal  ', companyName: ' Al Noor Grocery ', email: 'amal@alnoor.ae', phone: '+971 50 123 4567', storeType: 'Baqala', market: 'AE', lang: 'en', pageUrl: 'https://edukaan.example/' })
      .expect(201);
    expect(res.body.id).toEqual(expect.any(String));
    const saved = JSON.parse(readFileSync(leadsFile(), 'utf8').trim().split('\n').pop()!);
    expect(saved).toMatchObject({ id: res.body.id, name: 'Amal', companyName: 'Al Noor Grocery', email: 'amal@alnoor.ae', phone: '+971 50 123 4567', market: 'AE' });
    expect(readFileSync(leadsFile(), 'utf8')).not.toContain('test-recaptcha-token');
    const call = crmCalls.pop()!;
    expect(call.headers['x-api-key']).toBe('test-crm-key');
    expect(call.headers['g-recaptcha-response']).toBe('test-recaptcha-token');
    expect(call.headers['x-country']).toBe('ae');
    expect(call.headers['x-language']).toBe('en');
    expect(call.body).toEqual({
      form_type: 'POS',
      company_name: 'Al Noor Grocery',
      contact_name: 'Amal',
      email: 'amal@alnoor.ae',
      phone: '+971 50 123 4567',
      message: 'Call-back request from the Edukaan POS landing page. Market: UAE. Language: en. Store type: Baqala.',
      page_url: 'https://edukaan.example/',
      category: 'Baqala',
      buyer_segment: 'sme',
    });
  });

  it('sends KSA / Arabic leads with the matching country and language headers', async () => {
    await request(app.getHttpServer())
      .post('/api/leads')
      .send({ name: 'Omar', companyName: 'Bakr Perfumes', email: 'omar@bakr.sa', phone: '+966501234567', storeType: 'Perfume shop', market: 'SA', lang: 'ar' })
      .expect(201);
    const call = crmCalls.pop()!;
    expect(call.headers).not.toHaveProperty('g-recaptcha-response');
    expect(call.headers['x-country']).toBe('sa');
    expect(call.headers['x-language']).toBe('ar');
    expect(call.body).toMatchObject({ form_type: 'POS', category: 'Perfume shop', buyer_segment: 'sme', company_name: 'Bakr Perfumes', email: 'omar@bakr.sa' });
  });

  it('gives the page its reCAPTCHA site key from the environment', async () => {
    const res = await request(app.getHttpServer()).get('/api/config').expect(200);
    expect(res.body).toEqual({ recaptchaSiteKey: 'test-site-key' });
  });

  it.each([
    ['a missing name', { companyName: 'Al Noor', email: 'amal@alnoor.ae', phone: '+971501234567', market: 'AE' }],
    ['a missing company name', { name: 'Amal', email: 'amal@alnoor.ae', phone: '+971501234567', market: 'AE' }],
    ['a missing email', { name: 'Amal', companyName: 'Al Noor', phone: '+971501234567', market: 'AE' }],
    ['an empty email', { name: 'Amal', companyName: 'Al Noor', email: ' ', phone: '+971501234567', market: 'AE' }],
    ['a bad email', { name: 'Amal', companyName: 'Al Noor', email: 'amal@', phone: '+971501234567', market: 'AE' }],
    ['a bad phone number', { name: 'Amal', companyName: 'Al Noor', email: 'amal@alnoor.ae', phone: 'call me', market: 'AE' }],
    ['an unknown market', { name: 'Amal', companyName: 'Al Noor', email: 'amal@alnoor.ae', phone: '+971501234567', market: 'US' }],
    ['a non-http page URL', { name: 'Amal', companyName: 'Al Noor', email: 'amal@alnoor.ae', phone: '+971501234567', market: 'AE', pageUrl: 'javascript:alert(1)' }],
    ['unexpected fields', { name: 'Amal', companyName: 'Al Noor', email: 'amal@alnoor.ae', phone: '+971501234567', market: 'AE', admin: true }],
  ])('rejects %s', (_label, body) => request(app.getHttpServer()).post('/api/leads').send(body).expect(400));

  it('lists leads only with the token', async () => {
    await request(app.getHttpServer()).get('/api/leads').expect(401);
    await request(app.getHttpServer()).get('/api/leads').set('Authorization', 'Bearer wrong').expect(401);
    const res = await request(app.getHttpServer()).get('/api/leads').set('Authorization', 'Bearer test-token').expect(200);
    expect(res.body[1]).toMatchObject({ name: 'Amal', companyName: 'Al Noor Grocery' });
  });
});
