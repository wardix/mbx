import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NocPop } from '../entities/noc-pop.entity';

export class NocPopRepository extends Repository<NocPop> {
  constructor(
    @InjectRepository(NocPop)
    private nocPopRepository: Repository<NocPop>,
  ) {
    super(
      nocPopRepository.target,
      nocPopRepository.manager,
      nocPopRepository.queryRunner,
    );
  }

  async getApLinkedSubscription(apIds: number[]) {
    const apSet = apIds.join(', ');
    const sql = `
      SELECT cs.CustServId FROM CustomerServiceTechnicalLink cstl
      LEFT JOIN CustomerServices cs ON cs.CustServId = cstl.CustServId
      WHERE NOT (cs.CustStatus IN ('NA'))
      AND cstl.wirelessPopType = 'AP'
      AND cstl.wirelessPopTypeId IN (${apSet})
    `;
    return this.query(sql);
  }

  async getSwitchLinkedSubscription(swIds: number[]) {
    const swSet = swIds.join(', ');
    const sql = `
      SELECT cs.CustServId FROM CustomerServiceTechnicalLink cstl
      LEFT JOIN CustomerServices cs ON cs.CustServId = cstl.CustServId
      WHERE NOT (cs.CustStatus IN ('NA'))
      AND cstl.cableType = 'switch'
      AND cstl.cableTypeId IN (${swSet})
    `;
    return this.query(sql);
  }

  async getAllSwitch(popId: number) {
    const sql = `SELECT id FROM noc_pop_switch WHERE pop_id = ${popId}`;
    return this.query(sql);
  }

  async getAllAp(popId: number) {
    const sql = `SELECT id FROM noc_pop_ap WHERE pop_id = ${popId}`;
    return this.query(sql);
  }
}
