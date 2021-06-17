import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Interests } from "../client/interests.entity";

@Entity("interest", { schema: "academy" })
export class Interest {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("character varying", { nullable: true })
  title: string

  @Column("character varying", { nullable: true })
  description: string

  @Column("character varying", { nullable: true })
  image: string

  @Column("character varying", { nullable: true })
  color: string

  @Column('boolean', { nullable: true })
  principal: boolean

  @ManyToOne(() => Interest, interest => interest.childs, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  parent: Interest;

  @OneToMany(() => Interest, interest => interest.parent, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  childs: Interest[];

  @OneToMany(() => Interests, interests => interests.interest)
  interests: Interests[]
}