import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { Question } from "./question.entity";
import { UserQuestion } from "./user-question.entity";

@Entity("answer", { schema: "academy" })
export class Answer {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("boolean", { nullable: true, default: false })
  correct: boolean;

  @ManyToOne(type => Question, question => question.answers, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_question' })
  question: Question;

  @Column("bigint", { nullable: true })
  order: number;

  @OneToMany(type => UserQuestion, userQuestion => userQuestion.answer, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  userQuestions: UserQuestion[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}