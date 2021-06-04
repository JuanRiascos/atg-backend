import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";
import { Role } from "./role.entity";
import { States } from '../@enums/index.enum'

@Entity("user_role", { schema: 'user' })
export class UserRole {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: States, default: States.Active })
  state: States;

  @ManyToOne(
    type => User,
    user => user.roles,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(
    type => Role,
    role => role.users,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'fk_role' })
  role: Role;
}