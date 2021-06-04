import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Lesson } from "./lesson.entity";

@Entity("user_lesson_try", { schema: "academy" })
export class UserLessonTry {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @ManyToOne(type => Lesson, lesson => lesson.userLessonTry, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson;

  @ManyToOne(type => User, user => user.userLessonTry, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user' })
  user: User;
}