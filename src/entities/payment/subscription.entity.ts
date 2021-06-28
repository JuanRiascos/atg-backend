import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StateSubscription } from "../@enums/index.enum";
import { Client } from "../client/client.entity";
import { Plan } from "./plan.entity";

@Entity('subscription', { schema: 'payment' })
export class Subscription {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("character varying", { name: "id_stripe" })
  idStripe: string

  @Column('enum', { enum: StateSubscription, name: "state_subscription", nullable: true })
  stateSubscription: StateSubscription

  @ManyToOne(() => Client, client => client.subscriptions)
  @JoinColumn({ name: 'fk_client' })
  client: Client;

  @ManyToOne(() => Plan, plan => plan.subscriptions)
  @JoinColumn({ name: 'fk_plan' })
  plan: Plan;

}