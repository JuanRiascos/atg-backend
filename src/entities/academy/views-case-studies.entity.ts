import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { CaseStudies } from "./case-studies.entity";

@Entity('view_case_studies', { schema: 'academy' })
export class ViewCaseStudies {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('boolean', { nullable: true })
  first: boolean

  @CreateDateColumn({ type: "timestamp" })
  date: Date

  @ManyToOne(() => CaseStudies, caseStudy => caseStudy.views)
  @JoinColumn({ name: 'fk_case_study' })
  caseStudy: CaseStudies

  @ManyToOne(() => Client, client => client.viewsCaseStudies)
  @JoinColumn({ name: 'fk_client' })
  client: Client

}