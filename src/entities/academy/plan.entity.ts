import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Subscription } from "../payment/subscription.entity";
@Entity('plan', { schema: 'academy' })
export class Plan {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('character varying')
  description: string

  @Column('float', { nullable: true })
  price: number

  @Column('int', { nullable: true })
  duration: number

}