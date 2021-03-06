import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { Ocupation } from "./ocupation.entity";
import { Sport } from "./sport.entity";

import { User } from "./user.entity";
@Entity("person", { schema: 'user' })
export class Person {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { nullable: true, length: 50 })
  lastname: string;

  @Column("character varying", { nullable: true, length: 15 })
  phone: string;

  @Column('character varying', { nullable: true })
  image: string

  @Column('character varying', { nullable: true })
  positionCurrentJob: string

  @OneToOne(type => User, user => user.person, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(() => Ocupation, ocupation => ocupation.persons, {
    onDelete: 'SET NULL', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_ocupation' })
  ocupation: Ocupation;

  @ManyToOne(() => Sport, sport => sport.persons, {
    onDelete: 'SET NULL', onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_sport' })
  sport: Sport;

}