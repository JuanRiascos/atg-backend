import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Temary } from "./temary.entity";

@Entity("user_temary_try", { schema: "academy" })
export class UserTemaryTry {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @ManyToOne(type => Temary, temary => temary.userTemaryTry, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_temary' })
  temary: Temary;

  @ManyToOne(type => User, user => user.userTemaryTry, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user' })
  user: User;
}