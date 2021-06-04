import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../user/user.entity";

import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";
import { Question } from "./question.entity";
import { UserTemaryTry } from "./user-temary-try.entity";

@Entity("temary", { schema: "academy" })
export class Temary {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  title: any;

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("text", { nullable: true })
  image: string;

  @Column("bigint", { nullable: true })
  hours: number;

  @Column("bigint", { nullable: true })
  order: number;

  @Column("int", { default: 0, name: 'unlock_time' })
  unlockTime: number;

  @ManyToOne(type => Course, course => course.temarys, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_course' })
  course: Course;

  @OneToMany(type => Lesson, lesson => lesson.temary)
  lessons: Lesson[];

  @ManyToMany(type => User, user => user.temarys)
  @JoinTable({ name: 'user_temary' })
  users: User[];

  @OneToMany(type => Question, question => question.temary)
  questions: Question[];

  @OneToMany(type => UserTemaryTry, userTemaryTry => userTemaryTry.temary, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  userTemaryTry: UserTemaryTry[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}