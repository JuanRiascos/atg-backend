import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TypesRecurrence } from "../@enums/index.enum";

@Entity('plan', { schema: 'payment' })
export class Event {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ nullable: true, type: "bigint" })
  price: number;
  
  @Column('enum', { enum: TypesRecurrence, name: "types_recurrence" })
  typesRecurrence: TypesRecurrence
  
  @Column("character varying", { nullable: true })
  description: string;

}