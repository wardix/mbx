import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sms_satisfaction_score')
export class SmsSatisfaction extends BaseEntity {
  @PrimaryColumn()
  inboxId: number;

  @Column()
  ticketId: number;

  @Column()
  customerId: string;

  @Column()
  score: number;

  @Column()
  employeeId: string;

  @Column({ type: 'datetime' })
  insertTime: Date;

  @Column()
  minValue: number;

  @Column()
  maxValue: number;

  @Column({ nullable: true })
  generalTicketId: number;

  @Column({ name: 'followedUp', default: 0 })
  isFollowedUp: number;

  @Column({ name: 'notified', default: 0 })
  isNotified: number;

  @Column()
  assignedNo: number;

  @Column()
  ttsUpdateId: number;
}
