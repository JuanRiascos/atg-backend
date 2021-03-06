import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientQuestion } from "./client-question.entity";
import { Question } from "./question.entity";

@Entity('answer', { schema: 'academy' })
export class Answer {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("boolean", { nullable: true, default: false })
  correct: boolean;

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(() => Question, question => question.answers, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_question' })
  question: Question

  @ManyToMany(
    () => ClientQuestion, clientQuestion => clientQuestion.answers, {
      onDelete: 'CASCADE', onUpdate: 'CASCADE'
    }
  )
  clientQuestion: ClientQuestion[]
}