import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phonebook } from '../entities/phonebook.entity';

export class PhonebookRepository extends Repository<Phonebook> {
  constructor(
    @InjectRepository(Phonebook)
    private phonebookRepository: Repository<Phonebook>,
  ) {
    super(
      phonebookRepository.target,
      phonebookRepository.manager,
      phonebookRepository.queryRunner,
    );
  }

  async getValidSubscription(phone: string) {
    const sql = `
      SELECT cs.CustServId, cs.installation_address,
             IFNULL(cs.ServiceType, s.ServiceType) description,
             IFNULL(c.DisplayBranchId, c.BranchId) branchId
      FROM sms_phonebook pb
      LEFT JOIN CustomerServices cs ON cs.CustId = pb.custId
      LEFT JOIN Services s ON cs.ServiceId = s.ServiceId
      LEFT JOIN Customer c ON cs.CustId = c.CustId
      WHERE phone LIKE '%${phone}' AND NOT(cs.CustStatus IN ('NA'))
    `;
    return this.query(sql);
  }
}
