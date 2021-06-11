import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => Answer, answer => answer.clientQuestion)
  @JoinColumn({ name: 'fk_answer' })
  answer: Answer

  @ManyToOne(() => AssessmentClientTry, tryClient => tryClient.clientQuestion)
  @JoinColumn({ name: 'fk_try' })
  try: AssessmentClientTry

}