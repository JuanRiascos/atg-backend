import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Client } from "../client/client.entity";
@Entity("interest", { schema: "academy" })
export class Interest {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { nullable: true })
  title: string

  @Column("character varying", { nullable: true })
  description: string

  @Column('boolean', { nullable: true })
  principal: boolean

  @ManyToOne(() => Interest, interest => interest.childs, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  parent: Interest;

  @OneToMany(() => Interest, interest => interest.parent, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  childs: Interest[];

  @ManyToMany(() => Client, client => client.interests)
  @JoinTable()
  clients: Client[];
}