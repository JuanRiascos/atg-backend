import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { States } from "../@enums/index.enum";

@Entity('interests', { schema: 'client' })
export class Interests {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('enum', { enum: States })
  state: States
}