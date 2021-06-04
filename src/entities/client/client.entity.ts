import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from "typeorm";

import { States } from "../@enums/index.enum";
import { User } from "../user/user.entity";
import { Favorite } from "./favorite.entity";
import { PaymentHistory } from "./payment-history.entity";

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

  @OneToMany(() => Favorite, favorite => favorite.client)
  favorites: Favorite[]

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.client)
  payments: PaymentHistory[]

}