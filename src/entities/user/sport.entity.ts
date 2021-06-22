import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./person.entity";

@Entity("sport", { schema: 'user' })
export class Sport {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @OneToMany(() => Person, person => person.sport)
  persons: Person[];

}