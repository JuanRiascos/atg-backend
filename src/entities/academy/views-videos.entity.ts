import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../client/client.entity";
import { Video } from "./video.entity";

@Entity('view_videos', { schema: 'academy' })
export class ViewVideos {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column('boolean', { nullable: true, default: false })
  first: boolean

  @CreateDateColumn({ type: "timestamp" })
  date: Date

  @ManyToOne(() => Video, video => video.views)
  @JoinColumn({ name: 'fk_video' })
  video: Video

  @ManyToOne(() => Client, client => client.viewsVideos)
  @JoinColumn({ name: 'fk_client' })
  client: Client

}