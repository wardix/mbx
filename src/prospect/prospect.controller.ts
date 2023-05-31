import { Controller, Post, Body } from '@nestjs/common';
import { ProspectService } from './prospect.service';

@Controller('prospect')
export class ProspectController {
  constructor(private readonly prospectService: ProspectService) {}

  @Post('lead')
  async submitLead(@Body() {phone, name}: { phone: string; name: string }) {
    return this.prospectService.createLead(name, phone)
  }
}
