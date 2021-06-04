import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('reminder', { schema: 'notification' })
export class Reminder {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateAd: Date

  @Column('timestamp', { nullable: true })
  reminderDate: Date

  @Column('time', { nullable: true })
  reminderTime: Date
}