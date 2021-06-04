import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Question } from "./question.entity";
import { Answer } from "./answer.entity";
import { User } from "../user/user.entity";

@Entity("user_question", { schema: "academy" })
export class UserQuestion {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @ManyToOne(type => Answer, answer => answer.userQuestions, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_answer' })
  answer: Answer;

  @ManyToOne(type => User, user => user.userQuestions, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(type => Question, question => question.userQuestions, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_question' })
  question: Question;
}