import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from 'src/customers/customers.module';
import { NocIssue } from './entities/noc-issue.entity';
import { NocPop } from './entities/noc-pop.entity';
import { NocController } from './noc.controller';
import { NocService } from './noc.service';
import { NocIssueRepository } from './repositories/noc-issue.repository';
import { NocPopRepository } from './repositories/noc-pop.repository';

@Module({
  imports: [CustomersModule, TypeOrmModule.forFeature([NocIssue, NocPop])],
  controllers: [NocController],
  providers: [NocService, NocIssueRepository, NocPopRepository],
})
export class NocModule {}
