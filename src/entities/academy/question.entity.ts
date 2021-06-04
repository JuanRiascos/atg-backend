import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { Answer } from "./answer.entity";
import { Lesson } from "./lesson.entity";
import { UserQuestion } from "./user-question.entity";
import { Temary } from "./temary.entity";
import { Theme } from "./theme.entity";

@Entity("question", { schema: "academy" })
export class Question {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  description: any;

  @ManyToOne(type => Lesson, lesson => lesson.questions, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson;

  @ManyToOne(type => Theme, theme => theme.questions, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_theme' })
  theme: Theme;

  @ManyToOne(type => Temary, temary => temary.questions, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_temary' })
  temary: Temary;

  @Column("bigint", { nullable: true })
  order: number;

  @OneToMany(type => Answer, answer => answer.question)
  answers: Answer[];

  @OneToMany(type => UserQuestion, userQuestion => userQuestion.question, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  userQuestions: UserQuestion[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}