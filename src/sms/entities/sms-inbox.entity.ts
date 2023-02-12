import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sms_inbox')
export class SmsInbox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'received' })
  receivedTimestamp: number;

  @Column()
  sender: string;

  @Column({ name: 'msg', type: 'text' })
  message: string;

  @Column({ name: 'replied', default: 0 })
  isReplied: number;

  @Column({ name: 'new', default: 1 })
  isNew: number;

  @Column({ name: 'forwarded', default: 0 })
  isForwarded: number;
}
