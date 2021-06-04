import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EventType } from "./event-type.entity";
import { Notification } from "./notification.entity";

@Entity('event', { schema: 'notification' })
export class Event {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying', { nullable: true })
  description: String

  @ManyToOne(() => EventType, eventType => eventType.events)
  @JoinColumn({ name: 'fk_event_type' })
  eventType: EventType

  @OneToMany(() => Notification, notification => notification.event)
  notifications: Notification[]
}