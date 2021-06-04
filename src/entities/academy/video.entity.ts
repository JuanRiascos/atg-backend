import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, JoinTable } from "typeorm";

import { Lesson } from "./lesson.entity";
import { Category } from "./category.entity";
import { States } from "../@enums/index.enum";
import { User } from "../user/user.entity";

@Entity("video", { schema: "academy" })
export class Video {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  title: any;

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("text", { nullable: true, name: 'url_vimeo' })
  urlVimeo: string;

  @Column("bigint", { nullable: true })
  duration: number;

  @Column("text", { nullable: true })
  image: string;

  @Column("boolean", { nullable: true })
  streaming: boolean;

  @Column("boolean", { nullable: true })
  live: boolean;

  @Column("timestamp", { name: "start_date", nullable: true })
  startDate: Date;

  @Column("character varying", { name: 'cron_job_name', nullable: true })
  cronJobName: string;

  @Column("character varying", { name: 'cron_job_time', nullable: true })
  cronJobTime: string;

  @ManyToOne(type => Category, category => category.videos, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_category' })
  category: Category;

  @Column("enum", { enum: States, default: States.Active })
  state: States

  @OneToOne(type => Lesson, lesson => lesson.video, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson;

  @ManyToMany(type => User, user => user.videos)
  @JoinTable({ name: 'user_video' })
  users: User[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}