import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Lead } from './leads.service';

/** The lead as the Tradeling CRM leads API expects it (POST {CRM_LEADS_URL}). */
export interface CrmLead {
  /** Our lead id, so the CRM can recognise a repeat of the same submission. */
  submission_id: string;
  form_type: string;
  /** Market the form was filled under: AE (UAE) or SA (KSA), whatever the page language. */
  country: 'AE' | 'SA';
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  page_url?: string;
  category?: string;
  buyer_segment: string;
}

const MARKETS = { AE: 'UAE', SA: 'KSA' } as const;

export function toCrmLead(lead: Lead, formType = 'pos', buyerSegment = 'sme'): CrmLead {
  return {
    submission_id: lead.id,
    form_type: formType,
    country: lead.market,
    company_name: lead.companyName,
    contact_name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: `Call-back request from the Edukaan POS landing page. Market: ${MARKETS[lead.market]}. Language: ${lead.lang ?? 'en'}.`
      + (lead.storeType ? ` Store type: ${lead.storeType}.` : ''),
    ...(lead.pageUrl ? { page_url: lead.pageUrl } : {}),
    ...(lead.storeType ? { category: lead.storeType } : {}),
    buyer_segment: buyerSegment,
  };
}

/**
 * Forwards call-back requests to the Tradeling CRM's server-to-server leads API. Off until CRM_LEADS_URL is set.
 *
 * Authenticates with CRM_API_KEY in the CRM_API_KEY_HEADER header (default X-Tradeling-API-Key); keep the key in
 * the server's environment, never in the repository or the page. When the page sent a reCAPTCHA token it is
 * passed on too (g-recaptcha-response, with x-country / x-language), for CRM endpoints that check it.
 */
@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);
  private readonly url?: string;
  private readonly apiKey?: string;
  private readonly apiKeyHeader: string;
  private readonly formType: string;
  private readonly buyerSegment: string;

  constructor(config: ConfigService) {
    this.url = config.get<string>('CRM_LEADS_URL') || undefined;
    this.apiKey = config.get<string>('CRM_API_KEY') || undefined;
    this.apiKeyHeader = config.get<string>('CRM_API_KEY_HEADER') || 'X-Tradeling-API-Key';
    this.formType = config.get<string>('CRM_FORM_TYPE') || 'pos';
    this.buyerSegment = config.get<string>('CRM_BUYER_SEGMENT') || 'sme';
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
        body: JSON.stringify(toCrmLead(lead, this.formType, this.buyerSegment)),
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
