import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Plan } from "./plan.entity";

@Entity('subscription', { schema: 'payment' })
export class Subscription {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("character varying", { name: "id_stripe" })
  idStripe: string

  @ManyToOne(() => Client, client => client.subscriptions)
  @JoinColumn({ name: 'fk_client' })
  client: Client;

  @ManyToOne(() => Plan, plan => plan.subscriptions)
  @JoinColumn({ name: 'fk_plan' })
  plan: Plan;

}