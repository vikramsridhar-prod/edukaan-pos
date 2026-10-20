import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { CreateLeadDto } from './create-lead.dto';
import { CrmService } from './crm.service';

export interface Lead extends CreateLeadDto {
  id: string;
  createdAt: string;
}

/**
 * Stores call-back requests as JSON Lines (one lead per line) in LEADS_FILE, default data/leads.jsonl,
 * then forwards each one to the CRM (when CRM_LEADS_URL is set). The local copy is kept either way,
 * so nothing is lost if the CRM is down.
 */
@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  private readonly file: string;

  constructor(config: ConfigService, private readonly crm: CrmService) {
    this.file = resolve(config.get<string>('LEADS_FILE') ?? 'data/leads.jsonl');
  }

  async create(dto: CreateLeadDto, recaptchaToken?: string): Promise<Lead> {
    const lead: Lead = { id: randomUUID(), createdAt: new Date().toISOString(), ...dto };
    await mkdir(dirname(this.file), { recursive: true });
    await appendFile(this.file, JSON.stringify(lead) + '\n', 'utf8');
    this.logger.log(`New call-back request ${lead.id} (${lead.market})`);
    if (this.crm.enabled && (await this.crm.send(lead, recaptchaToken))) this.logger.log(`Lead ${lead.id} sent to the CRM`);
    return lead;
  }

  async findAll(): Promise<Lead[]> {
    try {
      const text = await readFile(this.file, 'utf8');
      return text.split('\n').filter(Boolean).map(line => JSON.parse(line) as Lead).reverse();
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }
  }
}
