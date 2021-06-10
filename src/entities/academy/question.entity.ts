import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "./answer.entity";
import { ClientQuestion } from "./client-question.entity";
import { Lesson } from "./lesson.entity";

@Entity('question', { schema: 'academy' })
export class Question {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Lesson, lesson => lesson.questions)
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[]

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.question)
  clientQuestion: ClientQuestion[]
}