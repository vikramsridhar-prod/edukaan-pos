import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Lead } from './leads.service';

/** The lead as the Tradeling CRM leads API expects it (POST {CRM_LEADS_URL}). */
export interface CrmLead {
  form_type: 'POS';
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  page_url?: string;
  buyer_segment?: string;
}

const MARKETS = { AE: 'UAE', SA: 'KSA' } as const;

export function toCrmLead(lead: Lead): CrmLead {
  return {
    form_type: 'POS',
    company_name: lead.companyName,
    contact_name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: `Call-back request from the Edukaan POS landing page. Market: ${MARKETS[lead.market]}. Language: ${lead.lang ?? 'en'}.`
      + (lead.storeType ? ` Store type: ${lead.storeType}.` : ''),
    ...(lead.pageUrl ? { page_url: lead.pageUrl } : {}),
    ...(lead.storeType ? { buyer_segment: lead.storeType } : {}),
  };
}

/**
 * Forwards call-back requests to the Tradeling CRM. Off until CRM_LEADS_URL is set.
 *
 * The CRM's public leads endpoint is protected by reCAPTCHA v3: the page gets a token from Google and this
 * service passes it on in the g-recaptcha-response header, with x-country / x-language like tradeling.com does.
 * If CRM_API_KEY is set it is also sent, in the CRM_API_KEY_HEADER header (default x-api-key); keep it in the
 * server's environment, never in the repository or the page.
 */
@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);
  private readonly url?: string;
  private readonly apiKey?: string;
  private readonly apiKeyHeader: string;

  constructor(config: ConfigService) {
    this.url = config.get<string>('CRM_LEADS_URL') || undefined;
    this.apiKey = config.get<string>('CRM_API_KEY') || undefined;
    this.apiKeyHeader = config.get<string>('CRM_API_KEY_HEADER') || 'x-api-key';
  }

  get enabled() {
    return !!this.url;
  }

  /** Sends the lead; resolves to true when the CRM accepted it. Never throws. */
  async send(lead: Lead, recaptchaToken?: string): Promise<boolean> {
    if (!this.url) return false;
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-country': lead.market.toLowerCase(),
          'x-language': lead.lang === 'ar' ? 'ar' : 'en',
          ...(recaptchaToken ? { 'g-recaptcha-response': recaptchaToken } : {}),
          ...(this.apiKey ? { [this.apiKeyHeader]: this.apiKey } : {}),
        },
        body: JSON.stringify(toCrmLead(lead)),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return true;
      const body = (await res.text()).slice(0, 300);
      this.logger.warn(`CRM rejected lead ${lead.id}: HTTP ${res.status} ${body}`);
    } catch (err) {
      this.logger.warn(`CRM unreachable for lead ${lead.id}: ${(err as Error).message}`);
    }
    return false;
  }
}
