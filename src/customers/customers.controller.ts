import { Controller, Get, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('blocked')
  async findAllBlocked(@Query('phone') phone: string) {
    return this.customersService.getBlockedSubscriptionMessage(phone);
  }
}
