import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Client } from "../client/client.entity";
import { Assessment } from "./assessment.entity";
import { Course } from "./course.entity";
import { ViewVideos } from "./views-videos.entity";
import { Check } from "./check.entity";
@Entity('video', { schema: 'academy' })
export class Video {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('character varying', { nullable: true })
  subtitle: string

  @Column('character varying', { nullable: true })
  description: string

  @Column('int', { nullable: true })
  duration: number

  @Column('character varying', { nullable: true })
  image: string

  @Column('character varying', { nullable: true })
  url: string

  @Column('character varying', { nullable: true })
  tag: string

  @Column('boolean', { default: false })
  free: boolean

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Course, course => course.videos, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @ManyToMany(type => Client, client => client.videos)
  @JoinTable({ name: 'playlist' })
  clients: Client[];

  @OneToMany(() => ViewVideos, view => view.video)
  views: ViewVideos[]

  @OneToMany(() => Check, check => check.video)
  checks: Check[]
}