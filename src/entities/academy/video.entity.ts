import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./lesson.entity";
import { Plan } from "./plan.entity";

@Entity('video', { schema: 'academy' })
export class Video {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  name: string

  @Column('int', { nullable: true })
  duration: number

  @Column('character varying', { nullable: true })
  image: string

  @Column('character varying', { nullable: true })
  url: string

  @ManyToOne(() => Lesson, lesson => lesson.files)
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson

  @ManyToMany(() => Plan, plan => plan.courses)
  @JoinTable({ name: 'video_plans' })
  plans: Plan[]
}