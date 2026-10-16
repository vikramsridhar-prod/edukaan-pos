import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateLeadDto } from './create-lead.dto';
import { LeadsTokenGuard } from './leads-token.guard';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /** Called by the landing page's "request a call back" form. */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLeadDto) {
    const lead = await this.leads.create(dto);
    return { id: lead.id };
  }

  /** For the sales team: every request so far, newest first. Needs LEADS_TOKEN. */
  @Get()
  @UseGuards(LeadsTokenGuard)
  findAll() {
    return this.leads.findAll();
  }
}
