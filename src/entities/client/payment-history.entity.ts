import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity('payment_history', { schema: 'client' })
export class PaymentHistory {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('timestamp')
  date: Date
  
  @Column('float')
  value: number

  @Column('json')
  detail: object

  @ManyToOne(() => Client, client => client.payments, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_client' })
  client: Client
}