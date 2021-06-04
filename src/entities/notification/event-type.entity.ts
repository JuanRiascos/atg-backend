import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "../@enums/index.enum";
import { EventTypeUser } from "./event-type-user.entity";
import { Event } from "./event.entity";

@Entity('event_type', { schema: 'notification' })
export class EventType {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  key: Events

  @OneToMany(() => Event, event => event.eventType)
  events: Event[]

  @OneToMany(() => EventTypeUser, eventTypeUser => eventTypeUser.eventType)
  users: EventTypeUser[]

}