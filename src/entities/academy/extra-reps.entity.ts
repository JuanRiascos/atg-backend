import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypesExtraReps } from "../@enums/index.enum";
import { Course } from "./course.entity";
import { Plan } from "./plan.entity";

@Entity('extra_reps', { schema: 'academy' })
export class ExtraReps {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('enum', { enum: TypesExtraReps })
  type: TypesExtraReps

  @Column('character varying', { nullable: true })
  fileUrl: string

  @ManyToOne(() => Course, course => course.extraReps)
  @JoinColumn({ name: 'fk_course' })
  course: Course
}