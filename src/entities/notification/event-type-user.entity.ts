import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { States } from "../@enums/index.enum";
import { User } from "../user/user.entity";
import { EventType } from "./event-type.entity";

@Entity('event-type-user', { schema: 'notification' })
export class EventTypeUser {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: States, default: States.Active })
  state: States

  @ManyToOne(() => EventType, eventType => eventType.users)
  @JoinColumn({ name: 'fk_event_type' })
  eventType: EventType

  @ManyToOne(() => User, user => user.eventsType)
  @JoinColumn({ name: 'fk_user' })
  user: User

}