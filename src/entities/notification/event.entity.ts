import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "../@enums/index.enum";
import { Notification } from "./notification.entity";

@Entity('event', { schema: 'notification' })
export class Event {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying', { nullable: true })
  description: String

  @Column('enum', { enum: Events })
  eventType: Events

  @OneToMany(() => Notification, notification => notification.event)
  notifications: Notification[]
}