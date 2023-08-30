import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsSent } from '../entities/sms-sent.entity';

export class SmsSentRepository extends Repository<SmsSent> {
  constructor(
    @InjectRepository(SmsSent) private smsSentRepository: Repository<SmsSent>,
  ) {
    super(
      smsSentRepository.target,
      smsSentRepository.manager,
      smsSentRepository.queryRunner,
    );
  }

  async getSentById(id: number): Promise<any> {
    const sql = `
      SELECT ss.id, ss.dst, ss.sent, ss.msg
      FROM sms_sent ss
      WHERE ss.id = ${id}`;
    return this.query(sql);
  }
}
