import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sms_sent')
export class SmsSent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dst' })
  destination: string;

  @Column({ name: 'sent' })
  sentTimestamp: number;

  @Column({ name: 'msg', type: 'text' })
  message: string;

  @Column({ name: 'emp' })
  employeeId: string;

  @Column({ nullable: true })
  outboxId: number;
}
