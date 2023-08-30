import { Injectable } from '@nestjs/common';
import { SmsInboxRepository } from './repositories/sms-inbox.repository';
import { SmsSentRepository } from './repositories/sms-sent.repository';
import { SmsSentSatisfactionRepository } from './repositories/sms-sent-satisfaction.repository';
import { SmsSatisfactionRepository } from './repositories/sms-satisfaction.repository';
import { SmsInbox } from './entities/sms-inbox.entity';
import { SmsSatisfaction } from './entities/sms-satisfaction.entity';
import { SmsSentSatisfaction } from './entities/sms-sent-satisfaction.entity';
import { SmsSent } from './entities/sms-sent.entity';

@Injectable()
export class SmsService {
  constructor(
    private smsInboxRepository: SmsInboxRepository,
    private smsSentRepository: SmsSentRepository,
    private smsSentSatisfactionRepository: SmsSentSatisfactionRepository,
    private smsSatisfactionRepository: SmsSatisfactionRepository,
  ) {}

  async createInbox(smsInboxData: Partial<SmsInbox>): Promise<SmsInbox> {
    const smsInbox = this.smsInboxRepository.create(smsInboxData);
    return this.smsInboxRepository.save(smsInbox);
  }

  async createSent(smsSentData: Partial<SmsSent>): Promise<SmsSent> {
    const smsSent = this.smsSentRepository.create(smsSentData);
    return this.smsSentRepository.save(smsSent);
  }

  async createSatisfaction(
    smsSatisfactionData: Partial<SmsSatisfaction>,
  ): Promise<SmsSatisfaction> {
    const smsSatisfaction =
      this.smsSatisfactionRepository.create(smsSatisfactionData);
    return this.smsSatisfactionRepository.save(smsSatisfaction);
  }

  async createSentSatisfaction(
    smsSentSatisfactionData: Partial<SmsSentSatisfaction>,
  ): Promise<SmsSentSatisfaction> {
    const smsSentSatisfaction = this.smsSentSatisfactionRepository.create(
      smsSentSatisfactionData,
    );
    return this.smsSentSatisfactionRepository.save(smsSentSatisfaction);
  }

  async updateSentSatisfaction(
    sentId: number,
    smsSentSatisfactionData: Partial<SmsSentSatisfaction>,
  ): Promise<SmsSentSatisfaction> {
    const smsSentSatisfaction =
      await this.smsSentSatisfactionRepository.findOne({ where: { sentId } });
    Object.assign(smsSentSatisfaction, smsSentSatisfactionData);
    return this.smsSentSatisfactionRepository.save(smsSentSatisfaction);
  }

  async getSentSatisfactionBySender(sender: string): Promise<any> {
    return this.smsSentSatisfactionRepository.getSentSatisfactionBySender(
      sender,
    );
  }

  async getSentById(id: number): Promise<any> {
    return this.smsSentRepository.getSentById(id);
  }
}
