import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";
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
}