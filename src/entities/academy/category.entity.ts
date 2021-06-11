import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Interests } from "../client/interests.entity";

@Entity("category", { schema: "academy" })
export class Category {

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

  @ManyToOne(() => Category, category => category.childs, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  childs: Category[];

  @OneToMany(() => Interests, interests => interests.category)
  interests: Interests[]
}