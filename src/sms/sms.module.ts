import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsInbox } from './entities/sms-inbox.entity';
import { SmsSatisfaction } from './entities/sms-satisfaction.entity';
import { SmsSentSatisfaction } from './entities/sms-sent-satisfaction.entity';
import { SmsSent } from './entities/sms-sent.entity';
import { SmsInboxRepository } from './repositories/sms-inbox.repository';
import { SmsSatisfactionRepository } from './repositories/sms-satisfaction.repository';
import { SmsSentSatisfactionRepository } from './repositories/sms-sent-satisfaction.repository';
import { SmsSentRepository } from './repositories/sms-sent.repository';
import { SmsService } from './sms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SmsSent,
      SmsInbox,
      SmsSatisfaction,
      SmsSentSatisfaction,
    ]),
  ],
  controllers: [],
  providers: [
    SmsService,
    SmsInboxRepository,
    SmsSentRepository,
    SmsSentSatisfactionRepository,
    SmsSatisfactionRepository,
  ],
  exports: [SmsService],
})
export class SmsModule {}
