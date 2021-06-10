import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { ClientQuestion } from "./client-question.entity";
import { Lesson } from "./lesson.entity";

@Entity('client_lesson_try', { schema: 'academy' })
export class ClientLessonTry {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @ManyToOne(() => Lesson, lesson => lesson.clientTrys)
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson

  @ManyToOne(() => Client, client => client.clientTrys)
  @JoinColumn({ name: 'fk_client' })
  client: Client

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.try)
  clientQuestion: ClientQuestion[]
}