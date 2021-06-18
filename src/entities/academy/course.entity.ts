import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { States } from "../@enums/index.enum";
import { Assessment } from "./assessment.entity";
import { CaseStudies } from "./case-studies.entity";
import { ExtraReps } from "./extra-reps.entity";
import { Plan } from "./plan.entity";
import { Video } from "./video.entity";

@Entity('course', { schema: 'academy' })
export class Course {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: States, default: States.Active })
  state: States

  @Column('character varying')
  title: string

  @Column('character varying')
  subtitle: string

  @Column('boolean', { nullable: true })
  cover: boolean

  @Column('character varying', { nullable: true })
  color: string

  @Column('character varying', { nullable: true })
  image: string

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  @ManyToMany(() => Plan, plan => plan.courses)
  @JoinTable({ name: 'course_plans' })
  plans: Plan[]

  @OneToMany(() => Video, video => video.course)
  videos: Video[]

  @OneToMany(() => ExtraReps, extraReps => extraReps.course)
  extraReps: ExtraReps[]

  @OneToMany(() => CaseStudies, caseStudies => caseStudies.course)
  caseStudies: CaseStudies[]

  @OneToMany(() => Assessment, assessment => assessment.course)
  assessments: Assessment[]
}