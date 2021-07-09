import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";
@Entity("versions", { schema: 'utils' })
export class Versions {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { name: 'apple_version', length: 20, nullable: true })
  appleVersion: string;

  @Column("character varying", { name: 'expo_version', length: 20, nullable: true })
  expoVersion: string;

  @Column("character varying", { name: 'expo_build', length: 20, nullable: true })
  expoBuild: string;
}