import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientLessonTry } from "./client-lesson-try.entity";
import { Course } from "./course.entity";
import { File } from "./file.entity";
import { Question } from "./question.entity";
import { Video } from "./video.entity";

@Entity('lesson', { schema: 'academy' })
export class Lesson {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('character varying', { nullable: true })
  subtitle: string

  @Column('character varying')
  description: string

  @ManyToOne(() => Course, course => course.lessons)
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @OneToMany(() => Video, video => video.lesson)
  videos: Video[]

  @OneToMany(() => File, file => file.lesson)
  files: File[]

  @OneToMany(() => Question, question => question.lesson)
  questions: Question[]

  @OneToMany(() => ClientLessonTry, clientTry => clientTry.lesson)
  clientTrys: ClientLessonTry[]
}