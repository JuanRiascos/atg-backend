import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { ExtraReps } from "./extra-reps.entity";

@Entity('view_extra_reps', { schema: 'academy' })
export class ViewExtraReps {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('boolean', { nullable: true, default: false })
  first: boolean

  @CreateDateColumn({ type: "timestamp" })
  date: Date

  @ManyToOne(() => ExtraReps, extra => extra.views, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_extra_reps' })
  extraRep: ExtraReps

  @ManyToOne(() => Client, client => client.viewsExtraReps, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_client' })
  client: Client

}