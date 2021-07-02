import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
} from "typeorm";

import { States } from "../@enums/index.enum";
import { AssessmentClientTry } from "../academy/assessment-client-try.entity";
import { ClientQuestion } from "../academy/client-question.entity";
import { Interest } from "../academy/interest.entity";
import { Video } from "../academy/video.entity";
import { Subscription } from "../payment/subscription.entity";
import { User } from "../user/user.entity";
import { Favorite } from "./favorite.entity";
import { PaymentHistory } from "./payment-history.entity";
import { StatusNotification } from "./status-notification.entity";

@Entity("client", { schema: 'client' })
export class Client {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("enum", { enum: States, default: States.Active })
  state: States;

  @Column("character varying", { name: "id_customer_stripe", nullable: true })
  idCustomerStripe: string;

  @Column('simple-json', { nullable: true })
  city: any

  @OneToOne(
    () => User,
    user => user.client,
    { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @OneToOne(
    () => User,
    user => user.client,
    { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_status_notification' })
  statusNotification: StatusNotification;

  @OneToMany(() => Favorite, favorite => favorite.client)
  favorites: Favorite[]

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.client)
  payments: PaymentHistory[]

  @ManyToMany(() => Interest, interest => interest.clients)
  interests: Interest[];

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.client)
  clientQuestion: ClientQuestion[]

  @OneToMany(() => AssessmentClientTry, trys => trys.client)
  trys: AssessmentClientTry[]

  @OneToMany(() => Subscription, subscription => subscription.client)
  subscriptions: Subscription[];

  @ManyToMany(type => Video, video => video.clients)
  videos: Video[];

}