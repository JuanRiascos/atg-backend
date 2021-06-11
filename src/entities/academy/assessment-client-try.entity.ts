import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Assessment } from "./assessment.entity";
import { ClientQuestion } from "./client-question.entity";

@Entity('assessment_client_try', { schema: 'academy' })
export class AssessmentClientTry {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @ManyToOne(() => Assessment, assessment => assessment.trys)
  @JoinColumn({ name: 'fk_assessment' })
  assessment: Assessment

  @ManyToOne(() => Client, client => client.trys)
  @JoinColumn({ name: 'fk_client' })
  client: Client

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.try)
  clientQuestion: ClientQuestion[]
}