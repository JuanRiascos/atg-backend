import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Assessment } from "./assessment.entity";
import { Course } from "./course.entity";
import { Plan } from "./plan.entity";

@Entity('video', { schema: 'academy' })
export class Video {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('int', { nullable: true })
  duration: number

  @Column('character varying', { nullable: true })
  image: string

  @Column('character varying', { nullable: true })
  url: string

  @Column('character varying', { nullable: true })
  tag: string

  @ManyToMany(() => Plan, plan => plan.courses)
  @JoinTable({ name: 'video_plans' })
  plans: Plan[]

  @ManyToOne(() => Course, course => course.videos)
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @OneToOne(() => Assessment, assessment => assessment.video)
  assessment: Assessment
}