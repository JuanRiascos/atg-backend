import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { Question } from "./question.entity";

@Entity("theme", { schema: "academy" })
export class Theme {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  title: any;

  @OneToMany(type => Question, question => question.theme)
  questions: Question[];
  
  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}