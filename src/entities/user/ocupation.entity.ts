import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./person.entity";

@Entity("ocupation", { schema: 'user' })
export class Ocupation {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @OneToMany(() => Person, person => person.ocupation)
  persons: Person[];

}