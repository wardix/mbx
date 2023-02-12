import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sms_sent_satisfaction_score')
export class SmsSentSatisfaction extends BaseEntity {
  @PrimaryColumn()
  sentId: number;

  @Column()
  ticketId: number;

  @Column()
  customerId: string;

  @Column({ name: 'responded', default: 0 })
  isResponded: number;

  @Column()
  respondedInboxId: number;

  @Column()
  assignedNo: number;

  @Column()
  ttsUpdateId: number;
}
