import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { States } from "../@enums/index.enum";
import { Category } from "./category.entity";
import { Lesson } from "./lesson.entity";
import { Plan } from "./plan.entity";

@Entity('course', { schema: 'academy' })
export class Course {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: States, default: States.Active })
  state: States

  @Column('character varying')
  title: string

  @Column('character varying')
  description: string

  @Column('float')
  hours: number

  @Column('character varying', { nullable: true })
  image: string

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  @ManyToMany(() => Category, category => category.courses)
  @JoinTable({ name: 'course_categories' })
  categories: Category[]

  @OneToMany(() => Lesson, lesson => lesson.course)
  lessons: Lesson[]

  @ManyToMany(() => Plan, plan => plan.courses)
  @JoinTable({ name: 'course_plans' })
  plans: Plan[]
}