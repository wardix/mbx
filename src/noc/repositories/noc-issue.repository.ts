import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NocIssue } from '../entities/noc-issue.entity';

export class NocIssueRepository extends Repository<NocIssue> {
  constructor(
    @InjectRepository(NocIssue)
    private nocIssueRepository: Repository<NocIssue>,
  ) {
    super(
      nocIssueRepository.target,
      nocIssueRepository.manager,
      nocIssueRepository.queryRunner,
    );
  }

  async getEffectedNocIssue() {
    const sql = `
      SELECT id, subject, eksternal effect, start_time, branchId,
             type, pop_id, ap_id
      FROM noc
      WHERE status = 'Open' AND effected_customer = 'Ya'
    `;
    return this.query(sql);
  }

  async getEffectedSubscription(issueIds: number[]) {
    if (issueIds.length == 0) {
      return [];
    }

    const issueIdSet = issueIds.join(', ');
    const sql = `
      SELECT noc_id, cs_id FROM noc_customer_service
      WHERE noc_id IN (${issueIdSet})
    `;
    return this.query(sql);
  }
}
