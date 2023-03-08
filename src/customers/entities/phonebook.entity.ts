import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sms_phonebook')
export class Phonebook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ name: 'custId' })
  customerId: string;
}
