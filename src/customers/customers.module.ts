import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { Phonebook } from './entities/phonebook.entity';
import { PhonebookRepository } from './repositories/phonebook.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Phonebook])],
  controllers: [],
  providers: [CustomersService, PhonebookRepository],
  exports: [CustomersService],
})
export class CustomersModule {}
