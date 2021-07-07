import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypesExtraReps } from "../@enums/index.enum";
import { Client } from "../client/client.entity";
import { Course } from "./course.entity";
import { ViewExtraReps } from "./views-extra-reps.entity";

@Entity('extra_reps', { schema: 'academy' })
export class ExtraReps {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('enum', { enum: TypesExtraReps })
  type: TypesExtraReps

  @Column('character varying', { nullable: true })
  fileUrl: string

  @Column('boolean', { default: false })
  free: boolean

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Course, course => course.extraReps)
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @ManyToMany(type => Client, client => client.extraReps)
  @JoinTable({ name: 'playlist_extra_reps' })
  clients: Client[];

  @OneToMany(() => ViewExtraReps, view => view.extraRep)
  views: ViewExtraReps[]

}