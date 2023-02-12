import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsSatisfaction } from '../entities/sms-satisfaction.entity';

export class SmsSatisfactionRepository extends Repository<SmsSatisfaction> {
  constructor(
    @InjectRepository(SmsSatisfaction)
    private smsSatisfaction: Repository<SmsSatisfaction>,
  ) {
    super(
      smsSatisfaction.target,
      smsSatisfaction.manager,
      smsSatisfaction.queryRunner,
    );
  }
}
