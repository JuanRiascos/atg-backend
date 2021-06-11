import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Assessment } from "./assessment.entity";
import { Course } from "./course.entity";
import { ExtraReps } from "./extra-reps.entity";
import { Video } from "./video.entity";

@Entity('plan', { schema: 'academy' })
export class Plan {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('character varying')
  description: string

  @Column('float', { nullable: true })
  price: number

  @Column('int', { nullable: true })
  duration: number

  @ManyToMany(() => Course, course => course.plans)
  courses: Course[]

  @ManyToMany(() => Video, video => video.plans)
  videos: Video[]

  @ManyToMany(() => ExtraReps, extraReps => extraReps.plans)
  extraReps: ExtraReps[]

  @ManyToMany(() => Assessment, assessment => assessment.plans)
  assessments: Assessment[]
}