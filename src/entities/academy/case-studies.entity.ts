import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";
import { Plan } from "./plan.entity";

@Entity('case-studies', { schema: 'academy' })
export class CaseStudies {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('character varying', { nullable: true })
  fileUrl: string

  @ManyToMany(() => Plan, plan => plan.caseStudies)
  @JoinTable({ name: 'case_studies_plans' })
  plans: Plan[]

  @ManyToOne(() => Course, course => course.caseStudies)
  @JoinColumn({ name: 'fk_course' })
  course: Course
}