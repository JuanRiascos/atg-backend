import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Plan } from "./plan.entity";

@Entity('subscription', { schema: 'payment' })
export class Subscription {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("character varying", { name: "id_stripe" })
  idStripe: string

  @ManyToOne(() => Client, client => client.subscriptions)
  client: Client;

  @ManyToOne(() => Plan, plan => plan.subscriptions)
  plan: Plan;

}