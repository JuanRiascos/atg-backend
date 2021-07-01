import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Answer } from "./answer.entity";
import { AssessmentClientTry } from "./assessment-client-try.entity";
import { Question } from "./question.entity";

@Entity('client_question', { schema: 'academy' })
export class ClientQuestion {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @ManyToOne(() => Client, client => client.clientQuestion)
  @JoinColumn({ name: 'fk_client' })
  client: Client

  @ManyToOne(() => Question, question => question.clientQuestion)
  @JoinColumn({ name: 'fk_question' })
  question: Question

  @ManyToMany(() => Answer, answer => answer.clientQuestion)
  @JoinTable()
  answers: Answer[]

  @ManyToOne(() => AssessmentClientTry, tryClient => tryClient.responses)
  @JoinColumn({ name: 'fk_try' })
  try: AssessmentClientTry

}