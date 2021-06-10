import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { States } from "../@enums/index.enum";
import { Category } from "../academy/category.entity";
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

  @ManyToOne(() => Category, category => category.interests)
  @JoinColumn({ name: 'fk_category' })
  category: Category
}