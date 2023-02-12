import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsSentSatisfaction } from '../entities/sms-sent-satisfaction.entity';

export class SmsSentSatisfactionRepository extends Repository<SmsSentSatisfaction> {
  constructor(
    @InjectRepository(SmsSentSatisfaction)
    private smsSentSatisfaction: Repository<SmsSentSatisfaction>,
  ) {
    super(
      smsSentSatisfaction.target,
      smsSentSatisfaction.manager,
      smsSentSatisfaction.queryRunner,
    );
  }

  async getSentSatisfactionBySender(sender: string): Promise<any> {
    const sql = `
      SELECT sss.sentId, sss.ticketId, sss.customerId, sss.responded, sss.respondedInboxId, sss.assignedNo, sss.ttsUpdateId
      FROM sms_sent_satisfaction_score sss
      LEFT JOIN sms_sent ss ON sss.sentId = ss.id
      WHERE ss.dst = '${sender}'
      ORDER BY sss.sentId DESC LIMIT 1`;
    return this.query(sql);
  }
}
