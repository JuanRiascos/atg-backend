import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./lesson.entity";

@Entity('file', { schema: 'academy' })
export class File {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column("text", { nullable: true })
  name: string;

  @Column('character varying')
  url: string

  @ManyToOne(() => Lesson, lesson => lesson.files)
  @JoinColumn({ name: 'fk_lesson' })
  lesson: Lesson
}