import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { CrmService } from './crm.service';
import { LeadsService } from './leads.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, CrmService],
})
export class LeadsModule {}
