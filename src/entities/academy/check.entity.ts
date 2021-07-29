import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { CheckClient } from "./check-client.entity";
import { Video } from "./video.entity";

@Entity('check', { schema: 'academy' })
export class Check {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("text", { nullable: true })
  description: any;

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Video, video => video.checks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'fk_video' })
  video: Video

  @OneToMany(() => CheckClient, checkClient => checkClient.client)
  clients: CheckClient[]
}