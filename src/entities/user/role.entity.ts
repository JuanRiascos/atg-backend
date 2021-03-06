import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import { UserRole } from "./user-role.entity";
import { States } from "../@enums/index.enum";

@Entity("role", { schema: 'user' })
@Unique(["key"])
export class Role {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 50 })
  name: string;

  @Column("character varying", { length: 50 })
  key: string;

  @Column("enum", { enum: States, default: States.Active })
  state: States

  @OneToMany(type => UserRole, userRole => userRole.role)
  users: UserRole[];

}