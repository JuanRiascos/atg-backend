import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from "typeorm";

import { Person } from "./person.entity";
import { UserRole } from "./user-role.entity";
import { UserPermission } from "./user-permission.entity";
import { States } from "../@enums/index.enum";
import { NotificationUser } from "../notification/notification-user.entity";
import { Client } from "../client/client.entity";
@Entity("user", { schema: 'user' })
@Unique(["email"])
export class User {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { length: 200 })
  email: string;

  @Column("character varying", { length: 250, nullable: true  })
  password: string;

  @Column("enum", { enum: States, default: States.Active })
  state: States;

  @Column("character varying", { nullable: true, length: 100 })
  code: string;

  @Column("character varying", { name: 'token_expo', nullable: true })
  tokenExpo: string;

  @Column("character varying", { name: 'social_media', nullable: true })
  socialMedia: string;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  @Column("boolean", { default: true, name: "is_authorize_email" })
  isAuthorizeEmail;

  @OneToOne(() => Person, person => person.user)
  person: Person;

  @OneToOne(() => Client, client => client.user)
  client: Client;

  @OneToMany(() => UserRole, userRole => userRole.user)
  roles: UserRole[];

  @OneToMany(() => UserPermission, userPermission => userPermission.user)
  permissions: UserPermission[];

  @OneToMany(() => NotificationUser, notifcationUser => notifcationUser.user)
  notifications: Notification[]

}