import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { States } from "../@enums/index.enum";
import { Client } from "./client.entity";

@Entity('favorite', { schema: 'client' })
export class Favorite {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @CreateDateColumn({ type: 'timestamp' })
  date: Date

  @Column('enum', { enum: States })
  state: States

  @ManyToOne(() => Client, client => client.favorites)
  @JoinColumn({ name: 'fk_client' })
  client: Client
  
}