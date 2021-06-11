import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from "typeorm";

import { States } from "../@enums/index.enum";
import { AssessmentClientTry } from "../academy/assessment-client-try.entity";
import { ClientQuestion } from "../academy/client-question.entity";
import { User } from "../user/user.entity";
import { Favorite } from "./favorite.entity";
import { Interests } from "./interests.entity";
import { PaymentHistory } from "./payment-history.entity";
import { StatusNotification } from "./status-notification.entity";

@Entity("client", { schema: 'client' })
export class Client {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("enum", { enum: States, default: States.Active })
  state: States;

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

  @OneToMany(() => Interests, interests => interests.client)
  interests: Interests[]

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.client)
  clientQuestion: ClientQuestion[]

  @OneToMany(() => AssessmentClientTry, trys => trys.client)
  trys: AssessmentClientTry[]
}