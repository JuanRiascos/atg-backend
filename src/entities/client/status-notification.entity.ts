import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity('status_notification', { schema: 'client' })
export class StatusNotification {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column('boolean', { nullable: true })
  notificationStatus: boolean

  @Column('simple-json', { nullable: true })
  notificationFirsTime: any

  @OneToOne(() => Client, client => client.statusNotification, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  client: Client
}