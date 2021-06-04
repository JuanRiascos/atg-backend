import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { States } from "../@enums/index.enum";
import { User } from "../user/user.entity";
import { Feature } from './feature.entity'
import { Temary } from "./temary.entity";

@Entity("course", { schema: "academy" })
export class Course {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  title: any;

  @Column("enum", { enum: States, default: States.Pending })
  state: States

  @Column("simple-json", { nullable: true })
  subtitle: any;

  @Column("simple-json", { nullable: true })
  description: any;

  @Column("text", { nullable: true })
  image: string;

  @Column("bigint", { nullable: true })
  hours: number;

  @Column("bigint", { nullable: true })
  order: number;

  @ManyToMany(type => User, user => user.courses)
  @JoinTable({ name: 'user_course' })
  users: User[];

  @OneToMany(type => Temary, temary => temary.course)
  temarys: Temary[];

  @OneToMany(type => Feature, feature => feature.course)
  features: Feature[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}