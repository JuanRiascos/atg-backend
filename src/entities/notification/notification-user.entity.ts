import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StateNotification } from "../@enums/index.enum";
import { Notification } from "./notification.entity";
import { User } from "../user/user.entity";

@Entity('notification_user', { schema: 'notification' })
export class NotificationUser {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('timestamp', { nullable: true })
  shippingDate: Date

  @Column('timestamp', { nullable: true })
  receivedDate: Date

  @Column('json', { nullable: true })
  payload: object

  @Column('enum', { enum: StateNotification, default: StateNotification.Send })
  stateNotification: StateNotification

  @Column('bool', { default: false, nullable: true })
  view: boolean

  @ManyToOne(() => User, user => user.notifications, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_user' })
  user: User

  @ManyToOne(() => Notification, notification => notification.users, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_notification' })
  notification: Notification
}