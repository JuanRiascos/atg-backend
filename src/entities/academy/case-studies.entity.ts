import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Course } from "./course.entity";

@Entity('case_studies', { schema: 'academy' })
export class CaseStudies {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('character varying', { nullable: true })
  fileUrl: string

  @Column('boolean', { default: false })
  free: boolean

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Course, course => course.caseStudies)
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @ManyToMany(type => Client, client => client.caseStudies)
  @JoinTable({ name: 'playlist_case_studies' })
  clients: Client[];
}