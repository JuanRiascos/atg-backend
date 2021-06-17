import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { States } from "../@enums/index.enum";
import { Interest } from "../academy/interest.entity";
import { Client } from "./client.entity";

@Entity('interests', { schema: 'client' })
export class Interests {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: States })
  state: States

  @ManyToOne(() => Client, client => client.interests)
  @JoinColumn({ name: 'fk_client' })
  client: Client

  @ManyToOne(() => Interest, interest => interest.interests)
  @JoinColumn({ name: 'fk_category' })
  interest: Interest
}