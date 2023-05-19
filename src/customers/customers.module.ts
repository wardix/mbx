import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Phonebook } from './entities/phonebook.entity';
import { PhonebookRepository } from './repositories/phonebook.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Phonebook]), ConfigModule],
  controllers: [CustomersController],
  providers: [CustomersService, PhonebookRepository],
  exports: [CustomersService],
})
export class CustomersModule {}
