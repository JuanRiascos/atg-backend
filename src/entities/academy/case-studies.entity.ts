import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Course } from "./course.entity";
import { ViewCaseStudies } from "./views-case-studies.entity";

@Entity('case_studies', { schema: 'academy' })
export class CaseStudies {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying')
  title: string

  @Column('enum', { nullable: true, enum: ['file', "richText"] })
  typeDoc: string

  @Column('character varying', { nullable: true })
  fileUrl: string

  @Column('character varying', { nullable: true })
  richText: string

  @Column('boolean', { default: false })
  free: boolean

  @Column('boolean', { default: false, nullable: true })
  authorizedSendEmail: boolean

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Course, course => course.caseStudies, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_course' })
  course: Course

  @ManyToMany(type => Client, client => client.caseStudies)
  @JoinTable({ name: 'playlist_case_studies' })
  clients: Client[];

  @OneToMany(() => ViewCaseStudies, view => view.caseStudy)
  views: ViewCaseStudies[]
}