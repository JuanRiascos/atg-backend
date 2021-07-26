import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypesNotifications } from "../@enums/index.enum";
import { Event } from "./event.entity";
import { NotificationUser } from "./notification-user.entity";

@Entity('notification', { schema: 'notification' })
export class Notification {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: TypesNotifications })
  type: TypesNotifications

  @CreateDateColumn({ type: 'timestamp' })
  date: Date

  @Column('json')
  payload: object

  @OneToMany(() => NotificationUser, notificationUser => notificationUser.notification)
  users: NotificationUser[]

  @ManyToOne(() => Event, event => event.notifications, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'fk_event' })
  event: Event

}