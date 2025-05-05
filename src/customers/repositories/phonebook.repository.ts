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

  async getInternetSubscription(phone: string) {
    const sql = `
      SELECT cs.CustServId, cs.installation_address,
             IFNULL(cs.ServiceType, s.ServiceType) description,
             IFNULL(c.DisplayBranchId, c.BranchId) branchId
      FROM sms_phonebook pb
      LEFT JOIN CustomerServices cs ON cs.CustId = pb.custId
      LEFT JOIN Services s ON cs.ServiceId = s.ServiceId
      LEFT JOIN ServiceGroup sg ON sg.ServiceGroup = s.ServiceGroup
      LEFT JOIN Customer c ON cs.CustId = c.CustId
      WHERE phone LIKE '%${phone}'
      AND cs.CustStatus NOT IN ('NA')
      AND ServiceGroupTypeId = 1
    `;
    return this.query(sql);
  }

  async getDigitalBusinessSubscription(phone: string) {
    const sql = `
      SELECT cs.CustServId, cs.CustDomain cust_domain,
             IFNULL(cs.ServiceType, s.ServiceType) description,
             IFNULL(c.DisplayBranchId, c.BranchId) branchId
      FROM sms_phonebook pb
      LEFT JOIN CustomerServices cs ON cs.CustId = pb.custId
      LEFT JOIN Services s ON cs.ServiceId = s.ServiceId
      LEFT JOIN ServiceGroup sg ON sg.ServiceGroup = s.ServiceGroup
      LEFT JOIN Customer c ON cs.CustId = c.CustId
      WHERE phone LIKE '%${phone}'
      AND cs.CustStatus NOT IN ('NA')
      AND ServiceGroupTypeId != 1
    `;
    return this.query(sql);
  }

  async getBlockedSubscription(phone: string) {
    const sql = `
      SELECT cs.CustServId, cs.installation_address,
             IFNULL(cs.ServiceType, s.ServiceType) description,
             IFNULL(c.DisplayBranchId, c.BranchId) branchId,
             cs.CustBlockFrom blockFromCustomerRequest
      FROM sms_phonebook pb
      LEFT JOIN CustomerServices cs ON cs.CustId = pb.custId
      LEFT JOIN Services s ON cs.ServiceId = s.ServiceId
      LEFT JOIN ServiceGroup sg ON sg.ServiceGroup = s.ServiceGroup
      LEFT JOIN Customer c ON cs.CustId = c.CustId
      WHERE pb.phone LIKE '%${phone}'
      AND cs.CustStatus IN ('BL')
      AND cs.CustBlockFrom = 0
      AND sg.ServiceGroupTypeId = 1
    `;
    return this.query(sql);
  }

  async getUnpaidInvoice(phone: string) {
    const sql = `
      SELECT c.CustId, IFNULL(c.CustCompany, c.CustName) CustName, c.Saldo 
      FROM Customer c 
      LEFT JOIN sms_phonebook sp ON c.CustId = sp.custId 
      WHERE sp.phone = ${phone} 
        AND c.Saldo < 0`;
    return this.query(sql);
  }

  async getCustomerTicketsOpen(phone: string) {
    const sql = `
      SELECT tts.TtsId ticketId, tts.Problem subject, tts.PostedTime createdAt, 
             JSON_OBJECT("firstName", e.EmpFName, "lastName", e.EmpLName) employee
      FROM sms_phonebook sp 
      LEFT JOIN Tts tts ON tts.custId = sp.custId
      LEFT JOIN Employee e ON e.EmpId = tts.EmpId
      WHERE sp.phone = '+${phone}'
        AND tts.Status NOT IN ('Cancel', 'Closed')`;

    return this.query(sql);
  }

  async getCustomerTicketsClosed(phone: string) {
    const sql = `
      SELECT tts.TtsId ticketId, tts.Problem subject, tts.PostedTime createdAt, 
             tu.UpdatedTime closedAt, JSON_OBJECT("firstName", e.EmpFName, "lastName", e.EmpLName) employee
      FROM sms_phonebook sp 
      LEFT JOIN Tts tts ON tts.CustId = sp.CustId 
      LEFT JOIN Employee e ON e.EmpId = tts.EmpId
      LEFT JOIN TtsUpdate tu on tu.TtsId = tts.TtsId
      LEFT JOIN TtsChange tc on tc.TtsUpdateId = tu.TtsUpdateId 
        AND tc.field = 'Status' 
      WHERE sp.phone = '+${phone}' 
        AND tts.Status IN ('Cancel', 'Closed')
        AND tc.NewValue IN ('Cancel', 'Closed') 
        AND tc.OldValue != tc.NewValue
        AND tu.UpdatedTime > DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `;

    return this.query(sql);
  }

  async getRecentReceipts(phone: string) {
    const sql = `
      SELECT nr.ReceiptId receiptId, nr.Amount amount, nr.insertDate date,
             JSON_OBJECT('custId', c.CustId, 'custName', c.CustName) customer
      FROM sms_phonebook sp
      LEFT JOIN NewReceipt nr ON nr.CustId = sp.custId
      LEFT JOIN Customer c ON c.CustId = nr.CustId
      WHERE sp.phone = '+${phone}'
        AND nr.Type = 'RA02'
        AND nr.Date > DATE_SUB(NOW(), INTERVAL 2 MONTH)
      ORDER BY nr.insertDate DESC
      `;
    return this.query(sql);
  }
}
