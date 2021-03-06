import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "./answer.entity";
import { Assessment } from "./assessment.entity";
import { ClientQuestion } from "./client-question.entity";

@Entity('question', { schema: 'academy' })
export class Question {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("text", { nullable: true })
  description: any;

  @Column("bigint", { nullable: true })
  order: number;

  @Column('boolean', { nullable: true, default: false })
  multiple: boolean

  @ManyToOne(() => Assessment, assessment => assessment.questions, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_assessment' })
  assessment: Assessment

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[]

  @OneToMany(() => ClientQuestion, clientQuestion => clientQuestion.question)
  clientQuestion: ClientQuestion[]
}