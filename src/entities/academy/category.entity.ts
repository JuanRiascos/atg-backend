import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { Video } from "./video.entity";

@Entity("category", { schema: "academy" })
export class Category {

  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column("simple-json", { nullable: true })
  title: any;

  @Column("text", { nullable: true })
  image: string;

  @OneToMany(type => Video, video => video.category)
  videos: Video[];
  
  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}