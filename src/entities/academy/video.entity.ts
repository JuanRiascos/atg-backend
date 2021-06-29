import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Assessment } from "./assessment.entity";
import { Course } from "./course.entity";
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

  @ManyToOne(() => Course, course => course.videos)
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @OneToOne(() => Assessment, assessment => assessment.video)
  assessment: Assessment
}