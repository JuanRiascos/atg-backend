import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, JoinTable } from "typeorm";

import { Temary } from "./temary.entity";
import { Video } from "./video.entity";
import { Question } from "./question.entity";
import { UserLessonTry } from "./user-lesson-try.entity";
import { File } from "./file.entity";

@Entity("lesson", { schema: "academy" })
export class Lesson {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  title: any;

  @Column("simple-json", { nullable: true })
  subtitle: any;

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToOne(type => Temary, temary => temary.lessons, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_temary' })
  temary: Temary;

  @OneToOne(type => Video, video => video.lesson) // specify inverse side as a second parameter
  video: Video;

  @OneToMany(type => Question, question => question.lesson)
  questions: Question[];

  @OneToMany(type => File, file => file.lesson)
  files: File[];

  @OneToMany(type => UserLessonTry, userLessonTry => userLessonTry.lesson, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  userLessonTry: UserLessonTry[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}