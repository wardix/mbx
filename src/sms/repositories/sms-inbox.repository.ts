import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsInbox } from '../entities/sms-inbox.entity';

export class SmsInboxRepository extends Repository<SmsInbox> {
  constructor(
    @InjectRepository(SmsInbox)
    private smsInboxRepository: Repository<SmsInbox>,
  ) {
    super(
      smsInboxRepository.target,
      smsInboxRepository.manager,
      smsInboxRepository.queryRunner,
    );
  }
}
