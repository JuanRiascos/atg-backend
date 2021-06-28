import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypesRecurrence } from "../@enums/index.enum";
import { Subscription } from "./subscription.entity";

@Entity('plan', { schema: 'payment' })
export class Plan {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("character varying", { name: "id_stripe" })
  idStripe: string;

  @Column({ nullable: true, type: "bigint" })
  price: number;

  @Column('enum', { enum: TypesRecurrence, name: "types_recurrence" })
  typesRecurrence: TypesRecurrence

  @Column("character varying", { nullable: true })
  description: string;

  @OneToMany(() => Subscription, subscription => subscription.plan)
  subscriptions: Subscription[];

}