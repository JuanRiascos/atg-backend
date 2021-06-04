import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { Lesson } from "./lesson.entity";

@Entity("file", { schema: "academy" })
export class File {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("text", { nullable: true })
  name: string;

  @Column("text", { nullable: true })
  url: string;

  @ManyToOne(type => Lesson, lesson => lesson.files, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}