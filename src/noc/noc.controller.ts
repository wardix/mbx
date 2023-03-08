import { Controller, Get, Query } from '@nestjs/common';
import { NocService } from './noc.service';

@Controller('noc')
export class NocController {
  constructor(private readonly nocService: NocService) {}

  @Get('issues')
  async findAllIssue(@Query('phone') phone: string) {
    return this.nocService.getEffectedNocIssueMessage(phone);
  }
}
