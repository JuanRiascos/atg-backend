import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('survey', { schema: 'academy' })
export class Survey {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('character varying', { nullable: true })
  title: string
}