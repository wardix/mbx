import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum NocIssueStatus {
  'Open',
  'Solved',
  'Close',
  'Scheduled',
  'Cancel',
}
enum NocIssueEffected {
  'Ya',
  'Tidak',
}
enum NocIssueType {
  'pop',
  'fttx',
  'server',
  'upstream',
}

@Entity('noc')
export class NocIssue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column()
  subject: string;

  @Column({
    type: 'enum',
    enum: NocIssueStatus,
  })
  status: NocIssueStatus;

  @Column({ name: 'pop_id' })
  popId: number;

  @Column({ name: 'ap_id' })
  apId: number;

  @Column()
  branchId: number;

  @Column({ name: 'fo_vendor_id' })
  foOperatorId: number;

  @Column({
    type: 'enum',
    name: 'effected_customer',
    enum: NocIssueEffected,
  })
  effected: NocIssueEffected;

  @Column({
    type: 'enum',
    enum: NocIssueType,
  })
  type: NocIssueType;
}
