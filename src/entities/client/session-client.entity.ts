import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity('session-client', { schema: 'client' })
export class SessionClient {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @ManyToOne(() => Client, client => client.sessions)
  @JoinColumn({ name: 'fk_client' })
  client: Client

  @Column('timestamp', { nullable: true })
  startTime: Date

  @Column('timestamp', { nullable: true })
  endTime: Date
}