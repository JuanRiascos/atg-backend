import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AssessmentClientTry } from "./assessment-client-try.entity";
import { Course } from "./course.entity";
import { Plan } from "./plan.entity";
import { Question } from "./question.entity";
import { Video } from "./video.entity";

@Entity('assessment', { schema: 'academy' })
export class Assessment {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @ManyToOne(() => Course, course => course.assessments)
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @ManyToMany(() => Plan, plan => plan.assessments)
  @JoinTable({ name: 'assessment_plans' })
  plans: Plan[]

  @OneToMany(() => Question, question => question.assessment)
  questions: Question[]

  @OneToOne(() => Video, video => video.assessment)
  @JoinColumn({ name: 'fk_video' })
  video: Video

  @OneToMany(() => AssessmentClientTry, trys => trys.assessment)
  trys: AssessmentClientTry[]
}