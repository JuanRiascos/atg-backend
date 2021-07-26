import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Video } from "./video.entity";

@Entity('check', { schema: 'academy' })
export class Check {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("text", { nullable: true })
  description: any;

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Video, video => video.checks, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_video' })
  video: Video

  @ManyToMany(() => Client, client => client.checks)
  @JoinTable({ name: 'checks_client' })
  clients: Client[]
}